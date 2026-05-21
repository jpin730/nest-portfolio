import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1779312656241 implements MigrationInterface {
  name = 'Migration1779312656241'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
        `)
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying(255) NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        `)
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying(255) NOT NULL
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" text NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
        `)
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" text NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        `)
  }
}
