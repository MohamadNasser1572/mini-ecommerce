# Databse

the database here was sqlite but I changed it to postgresql because sqlite only does one write at a time and postgresql can be used like buy at the same time. I used prisma since it is the tool the codes uses to talk to the database.

the database stores the users, products, cart, wishlist and orders

the main parts are the user that has email, and a password stored as a hash. product that have a title, desc, price and image it also contain some variants, like color size storage, cart item that shows what is inside each user cart, also wishlist, order which is one per row, and order item that shows what is inside each order.

each stock is on the variant, the prices are in cents so we avoid rounding mistakes. 

the OrderItem saves the title and price and one cart row per user and variant. 

deleting a user will delete his cart, wishlist and orders

important, if we want to add a new user, we cant add it and then login it will say invalid name or pass, we have to add it in pgadmin, but still the pass should be hashed so in the terminal we hash it then go to pgadmin and add the user there 