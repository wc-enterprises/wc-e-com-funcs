import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { OrderLineItems } from '../../../firestore/documents/firebase.document';
import {
  StandardResponse,
  createSuccessResponse,
} from 'src/utils/std-response';

@Injectable()
export class OrderLineItemservice{
    private logger : Logger = new Logger(OrderLineItemservice.name);

    constructor(
        @Inject(OrderLineItems.collectionName)
        private orderCollection:  CollectionReference<OrderLineItems>
    ){}

    async createOrderLine(
        data : OrderLineItems | OrderLineItems[]
    ):Promise<
      StandardResponse<
        | Pick<OrderLineItems , 'id'>
        | Pick<OrderLineItems , 'id'>[]
      >
      >{
        if (Array.isArray(data)) {
            const batch = this.orderCollection.firestore.batch();
            const createdOrderLineItem: Pick<OrderLineItems, 'id' >[] = [];
      
            for (const orderLine of data) {
              const docRef = this.orderCollection.doc(orderLine.id);
              batch.set(docRef, orderLine);
              
              createdOrderLineItem.push({ id: orderLine.id});
            }
      
            await batch.commit();
            return createSuccessResponse(
              'OrderLineItem created successfully',
              createdOrderLineItem,
            );
          }else {
            const docRef = this.orderCollection.doc(data.id)
            await docRef.set(data);
            return createSuccessResponse('OrderLineItem created successfully', {
                id: data.id    
              });
            }
        }

    async findAll(): Promise<OrderLineItems[]> {
        const snapshot = await this.orderCollection.get();
        const Ordersline: OrderLineItems[] = [];
        snapshot.forEach((doc) => Ordersline.push(doc.data()));
        return Ordersline;
        }

    async updateOrderLine(
        id: string,
        newData: Partial<OrderLineItems>,
        ): Promise<void> {
        const docRef = this.orderCollection.doc(id);
        await docRef.update(newData);
        }  
        
    async deleteOrderLine(id: string): Promise<void> {
        const docRef = this.orderCollection.doc(id);
            await docRef.delete();
        }
}