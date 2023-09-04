import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { OrderLineItem } from '../../../firestore/documents/firebase.document';
import {
  StandardResponse,
  createSuccessResponse,
} from 'src/utils/std-response';

@Injectable()
export class OrderLineItemservice{
    private logger : Logger = new Logger(OrderLineItemservice.name);

    constructor(
        @Inject(OrderLineItem.collectionName)
        private orderCollection:  CollectionReference<OrderLineItem>
    ){}

    async createOrderLine(
        data : OrderLineItem | OrderLineItem[]
    ):Promise<
      StandardResponse<
        | Pick<OrderLineItem , 'id'>
        | Pick<OrderLineItem , 'id'>[]
      >
      >{
        if (Array.isArray(data)) {
            const batch = this.orderCollection.firestore.batch();
            const createdOrderLineItem: Pick<OrderLineItem, 'id' >[] = [];
      
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

    async findAll(): Promise<OrderLineItem[]> {
        const snapshot = await this.orderCollection.get();
        const Ordersline: OrderLineItem[] = [];
        snapshot.forEach((doc) => Ordersline.push(doc.data()));
        return Ordersline;
        }

    async updateOrderLine(
        id: string,
        newData: Partial<OrderLineItem>,
        ): Promise<void> {
        const docRef = this.orderCollection.doc(id);
        await docRef.update(newData);
        }  
        
    async deleteOrderLine(id: string): Promise<void> {
        const docRef = this.orderCollection.doc(id);
            await docRef.delete();
        }
}