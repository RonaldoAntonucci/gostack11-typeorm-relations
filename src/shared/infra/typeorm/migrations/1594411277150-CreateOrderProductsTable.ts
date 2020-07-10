import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrderProductsTable1594411277150
  implements MigrationInterface {
  table = new Table({
    name: 'orders_products',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      { name: 'order_id', type: 'uuid' },
      { name: 'product_id', type: 'uuid', isNullable: true },
      {
        name: 'price',
        type: 'decimal',
        isNullable: false,
        scale: 2,
        precision: 15,
      },
      {
        name: 'quantity',
        type: 'integer',
        isNullable: false,
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
