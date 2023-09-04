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

@Controller()
export class OrderController {
    constructor(private readonly OrderService: OrderService) {}

    @Post('create-order')
    createOrder(@Body() data: Omit<OrderDocument, 'id'>) {
    const id = generateRandIds();

    const order: OrderDocument = {
      id,
      ...data,
    };
    return this.OrderService.createOrder(order);
  }

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