import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrderService = container.resolve(FindOrderService);

    const orderService = await findOrderService.execute({ id });

    return response.json(orderService);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { products, customer_id } = request.body;

    const createOrderService = container.resolve(CreateOrderService);

    const orderService = await createOrderService.execute({
      customer_id,
      products,
    });

    return response.json(orderService);
  }
}
