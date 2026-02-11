import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Create orders for each item
        const items = JSON.parse(session.metadata?.items || '[]');
        const userId = session.metadata?.userId;

        if (!userId || items.length === 0) {
          console.error('Missing userId or items in session metadata');
          break;
        }

        // Create orders for each item
        for (const item of items) {
          const product = await prisma.product.findUnique({
            where: { id: item.id },
          });

          if (product) {
            await prisma.order.create({
              data: {
                userId,
                productId: product.id,
                pricePaidInCents: product.priceInCents * item.quantity,
              },
            });
          }
        }

        console.log('Orders created for session:', session.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
