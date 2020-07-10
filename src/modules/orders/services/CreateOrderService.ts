import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid Customer id.');
    }

    const savedProducts = await this.productsRepository.findAllById(products);

    if (products.length !== savedProducts.length) {
      throw new AppError('Invalid Products List.');
    }

    const productsFinal = savedProducts.map(prod => {
      const productInArray = products.find(p => p.id === prod.id);

      let quantity = -1;

      if (productInArray && productInArray?.quantity <= prod.quantity) {
        quantity = productInArray.quantity;
      }

      return {
        product_id: prod.id,
        price: prod.price,
        quantity,
      };
    });

    if (!productsFinal.every(p => p.quantity >= 0)) {
      throw new AppError('Invalid Products List.');
    }

    const order = await this.ordersRepository.create({
      customer,
      products: productsFinal,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
