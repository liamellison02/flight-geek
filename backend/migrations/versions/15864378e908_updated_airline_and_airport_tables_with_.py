"""Updated Airline and Airport tables with api ids

Revision ID: 15864378e908
Revises: 8a336ee9562e
Create Date: 2024-12-07 01:28:49.561294

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '15864378e908'
down_revision = '8a336ee9562e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('airlines', schema=None) as batch_op:
        batch_op.add_column(sa.Column('airline_id_iata', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('airline_id_icao', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=False))
        batch_op.alter_column('id',
               existing_type=sa.VARCHAR(length=10),
               type_=sa.Integer(),
               existing_nullable=False,
               autoincrement=True)
        batch_op.drop_column('airline_id')

    with op.batch_alter_table('airports', schema=None) as batch_op:
        batch_op.add_column(sa.Column('airport_id_iata', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=False))
        batch_op.alter_column('id',
               existing_type=sa.VARCHAR(length=10),
               type_=sa.Integer(),
               existing_nullable=False,
               autoincrement=True)
        batch_op.drop_column('airport_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('airports', schema=None) as batch_op:
        batch_op.add_column(sa.Column('airport_id', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
        batch_op.alter_column('id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(length=10),
               existing_nullable=False,
               autoincrement=True)
        batch_op.drop_column('name')
        batch_op.drop_column('airport_id_iata')

    with op.batch_alter_table('airlines', schema=None) as batch_op:
        batch_op.add_column(sa.Column('airline_id', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
        batch_op.alter_column('id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(length=10),
               existing_nullable=False,
               autoincrement=True)
        batch_op.drop_column('name')
        batch_op.drop_column('airline_id_icao')
        batch_op.drop_column('airline_id_iata')

    # ### end Alembic commands ###
