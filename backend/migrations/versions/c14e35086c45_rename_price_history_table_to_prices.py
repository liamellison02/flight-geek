"""Rename price_history table to prices

Revision ID: c14e35086c45
Revises: b732ee757168
Create Date: 2024-12-06 23:40:09.386481

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c14e35086c45'
down_revision = 'b732ee757168'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('prices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('flight_id', sa.Integer(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['flight_id'], ['flights.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('price_history')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('price_history',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('flight_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False),
    sa.Column('timestamp', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['flight_id'], ['flights.id'], name='price_history_flight_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='price_history_pkey')
    )
    op.drop_table('prices')
    # ### end Alembic commands ###
