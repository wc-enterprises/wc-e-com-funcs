import {
    Body,
    Controller,
    Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from '../logics/order.service';
import { generateRandIds } from 'src/utils/generateRandIds';
import { OrderDocument } from '../../../firestore/documents/firebase.document';
import {Iorder} from 'src/utils/interface';
import {Validation} from 'src/utils/Validation'
import { OrderAggregateService } from '../logics/order-aggregate.service';

@Controller()
export class OrderController {
    constructor(private readonly OrderService: OrderService, private readonly OrderAggregateService: OrderAggregateService) {}

  //   @Post('create-order')
  //   createOrder(@Body() data: Omit<OrderDocument, 'id'>) {
  //   const id = generateRandIds();

  //   const order: OrderDocument = {
  //     id,
  //     ...data,
  //   };
  //   return this.OrderService.createOrder(order);
  // }
  
  @Post('create-orders')
  createOrders(@Body() data: Omit<OrderDocument, 'id'>[]) {
    const products: OrderDocument[] = [];
  
    data.forEach((item) => {
      const id = generateRandIds();
      products.push({
        id,
        ...item,
      });
    });

    return this.OrderService.createOrder(products);
  }

  @Post('create-order')
  createOrder(@Body() data:Omit<Iorder , "orderLineItems">){
    try{
      const id = generateRandIds();
      const date = new Date()

      //Validation
      Validation.OrderValidator(data)
      const order : OrderDocument = {
        ...data,
        id,
        date_created : date.toLocaleDateString(),
        total : 0,
      }                                             //req id
      return this.OrderAggregateService.createOrder(data.customer_id,order)
    }
    catch(err){
      console.log(err.message)
      return{
        statusCode : 400,
        message : err.message
      }
    }  
  }


  //   @Post('create-order')
  //   createOrder(@Body() data: Omit<Iorder , 'orderLineItems'>) {
  //   try{
  //     const id = generateRandIds();
  //     const date = new Date()

  //     Validation.OrderValidator(data)

  //     const order:OrderDocument = {
  //       ...data,
  //       id,  
  //       date_created :date.toLocaleDateString(),
  //       total:0,
  //     };
  //     return this.OrderService.createOrder(order);
  //   }
  //   catch(err){
  //       console.log(err.message)
  //   }
   
  // }

  
  // @Post('create-orders')
  // createOrders(@Body() data:{orderLineItems: {product_id: string; quantity: string}[] }) {
  //   const products: OrderDocument[] = [];
    
  //   Validation.orderLineItemsValidator(data)

  //   data.orderLineItems.forEach((item) => {
  //     const id = generateRandIds();
  //     products.push({
        
  //       ...item,
  //     });
  //   });

  //   return this.OrderService.createOrder(products);
  // }

  @Get('fetch-all-orders')
  fetchAllOrders() {
    return this.OrderService.findAll();
  }

  @Patch('update-order/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateData: Partial<OrderDocument>,
  ) {
    console.log('id', id);
    console.log('updateData', updateData);
    return this.OrderService.updateOrder(id, updateData);
  }

  @Delete('delete-order/:id')
  deleteOrder(@Param('id') id: string) {
    return this.OrderService.deleteOrder(id);
  }
}