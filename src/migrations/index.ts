import * as migration_20260523_124715_add_media_collection from './20260523_124715_add_media_collection';
import * as migration_20260523_193000_add_products_collection from './20260523_193000_add_products_collection';
import * as migration_20260523_200000_add_carts_collection from './20260523_200000_add_carts_collection';
import * as migration_20260523_210000_add_wishlists_collection from './20260523_210000_add_wishlists_collection';
import * as migration_20260524_000000_add_coupons_collection from './20260524_000000_add_coupons_collection';
import * as migration_20260524_010000_add_orders_collection from './20260524_010000_add_orders_collection';
import * as migration_20260524_020000_add_reviews_collection from './20260524_020000_add_reviews_collection';
import * as migration_20260524_030000_add_shippingzones_collection from './20260524_030000_add_shippingzones_collection';
import * as migration_20260524_040000_add_blogposts_collection from './20260524_040000_add_blogposts_collection';
import * as migration_20260524_050000_add_pages_collection from './20260524_050000_add_pages_collection';
import * as migration_20260524_060000_add_contactmessages_collection from './20260524_060000_add_contactmessages_collection';
import * as migration_20260524_070000_add_emaillogs_collection from './20260524_070000_add_emaillogs_collection';
import * as migration_20260524_203510_seed_updates from './20260524_203510_seed_updates';
import * as migration_20260603_202126_add_product_fields from './20260603_202126_add_product_fields';
import * as migration_20260702_150000_localize_content_fields from './20260702_150000_localize_content_fields';
import * as migration_20260703_064000_add_nextauth_user_fields from './20260703_064000_add_nextauth_user_fields';
import * as migration_20260703_233000_add_order_sms_updates from './20260703_233000_add_order_sms_updates';
import * as migration_20260704_004500_add_order_payment_method from './20260704_004500_add_order_payment_method';
import * as migration_20260704_060000_add_product_best_seller from './20260704_060000_add_product_best_seller';
import * as migration_20260704_070000_add_product_coa_fields from './20260704_070000_add_product_coa_fields';
import * as migration_20260705_120000_add_coupon_is_active_and_verify_backfill from './20260705_120000_add_coupon_is_active_and_verify_backfill';

export const migrations = [
  {
    up: migration_20260523_124715_add_media_collection.up,
    down: migration_20260523_124715_add_media_collection.down,
    name: '20260523_124715_add_media_collection',
  },
  {
    up: migration_20260523_193000_add_products_collection.up,
    down: migration_20260523_193000_add_products_collection.down,
    name: '20260523_193000_add_products_collection',
  },
  {
    up: migration_20260523_200000_add_carts_collection.up,
    down: migration_20260523_200000_add_carts_collection.down,
    name: '20260523_200000_add_carts_collection',
  },
  {
    up: migration_20260523_210000_add_wishlists_collection.up,
    down: migration_20260523_210000_add_wishlists_collection.down,
    name: '20260523_210000_add_wishlists_collection',
  },
  {
    up: migration_20260524_000000_add_coupons_collection.up,
    down: migration_20260524_000000_add_coupons_collection.down,
    name: '20260524_000000_add_coupons_collection',
  },
  {
    up: migration_20260524_010000_add_orders_collection.up,
    down: migration_20260524_010000_add_orders_collection.down,
    name: '20260524_010000_add_orders_collection',
  },
  {
    up: migration_20260524_020000_add_reviews_collection.up,
    down: migration_20260524_020000_add_reviews_collection.down,
    name: '20260524_020000_add_reviews_collection',
  },
  {
    up: migration_20260524_030000_add_shippingzones_collection.up,
    down: migration_20260524_030000_add_shippingzones_collection.down,
    name: '20260524_030000_add_shippingzones_collection',
  },
  {
    up: migration_20260524_040000_add_blogposts_collection.up,
    down: migration_20260524_040000_add_blogposts_collection.down,
    name: '20260524_040000_add_blogposts_collection',
  },
  {
    up: migration_20260524_050000_add_pages_collection.up,
    down: migration_20260524_050000_add_pages_collection.down,
    name: '20260524_050000_add_pages_collection',
  },
  {
    up: migration_20260524_060000_add_contactmessages_collection.up,
    down: migration_20260524_060000_add_contactmessages_collection.down,
    name: '20260524_060000_add_contactmessages_collection',
  },
  {
    up: migration_20260524_070000_add_emaillogs_collection.up,
    down: migration_20260524_070000_add_emaillogs_collection.down,
    name: '20260524_070000_add_emaillogs_collection',
  },
  {
    up: migration_20260524_203510_seed_updates.up,
    down: migration_20260524_203510_seed_updates.down,
    name: '20260524_203510_seed_updates',
  },
  {
    up: migration_20260603_202126_add_product_fields.up,
    down: migration_20260603_202126_add_product_fields.down,
    name: '20260603_202126_add_product_fields',
  },
  {
    up: migration_20260702_150000_localize_content_fields.up,
    down: migration_20260702_150000_localize_content_fields.down,
    name: '20260702_150000_localize_content_fields',
  },
  {
    up: migration_20260703_064000_add_nextauth_user_fields.up,
    down: migration_20260703_064000_add_nextauth_user_fields.down,
    name: '20260703_064000_add_nextauth_user_fields',
  },
  {
    up: migration_20260703_233000_add_order_sms_updates.up,
    down: migration_20260703_233000_add_order_sms_updates.down,
    name: '20260703_233000_add_order_sms_updates',
  },
  {
    up: migration_20260704_004500_add_order_payment_method.up,
    down: migration_20260704_004500_add_order_payment_method.down,
    name: '20260704_004500_add_order_payment_method',
  },
  {
    up: migration_20260704_060000_add_product_best_seller.up,
    down: migration_20260704_060000_add_product_best_seller.down,
    name: '20260704_060000_add_product_best_seller',
  },
  {
    up: migration_20260704_070000_add_product_coa_fields.up,
    down: migration_20260704_070000_add_product_coa_fields.down,
    name: '20260704_070000_add_product_coa_fields',
  },
  {
    up: migration_20260705_120000_add_coupon_is_active_and_verify_backfill.up,
    down: migration_20260705_120000_add_coupon_is_active_and_verify_backfill.down,
    name: '20260705_120000_add_coupon_is_active_and_verify_backfill',
  },
];
