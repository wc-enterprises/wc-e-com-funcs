import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { OrderDocument } from '../../../firestore/documents/firebase.document';
import {
  StandardResponse,
  createSuccessResponse,
} from 'src/utils/std-response';

@Injectable()
export class OrderService{
    private logger : Logger = new Logger(OrderService.name);

    constructor(
        @Inject(OrderDocument.collectionName)
        private orderCollection:  CollectionReference<OrderDocument>
    ){}

    async createOrder(
        data : OrderDocument | OrderDocument[]
    ):Promise<
      StandardResponse<
        | Pick<OrderDocument , 'id'>
        | Pick<OrderDocument , 'id'>[]
      >
      >{
        let Orderids = []
        if (Array.isArray(data)) {
            const batch = this.orderCollection.firestore.batch();
            const createdOrder: Pick<OrderDocument, 'id' >[] = [];

            for (const order of data) {
              const docRef = this.orderCollection.doc(order.id);
              batch.set(docRef, order);
      
              createdOrder.push({ id: order.id});
            }
      
            await batch.commit();
            return createSuccessResponse(
              'Order created successfully',
              createdOrder,
            );
          }else {
            const docRef = this.orderCollection.doc(data.id)
            await docRef.set(data);
            return createSuccessResponse('Order created successfully', {
                id: data.id    
              });
            }
        }

    async findAll(): Promise<OrderDocument[]> {
        const snapshot = await this.orderCollection.get();
        const Orders: OrderDocument[] = [];
        snapshot.forEach((doc) => Orders.push(doc.data()));
        return Orders;
        }

    async updateOrder(
        id: string,
        newData: Partial<OrderDocument>,
        ): Promise<void> {
        const docRef = this.orderCollection.doc(id);
        await docRef.update(newData);
        }

    async deleteOrder(id: string): Promise<void> {
        const docRef = this.orderCollection.doc(id);
            await docRef.delete();
        }
} 


   
