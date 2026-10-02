# Frontend

forntend of this app is what the user sees and interacts with, I used react, vite, typescript, tailwind css, tanstack query, and react context for auth.

I used react since it is used for building such uis, vite since it is a fast build tool, typescript for upgraded js, styling, tanstack query for fetching the data etc, and auth react since it manages the auth state.

the main parts of the frontend is the pages, api and components.api that talks to the backend, also pages that are the different pages of the app. Also responsive design is important to make sure the app looks good on different screen sizes.

an example like add to cart, it sends a request to /api/cart and the browser will include the cookie. then the backedn will come back with the full updated cart, and the frontend will update the state and re-render the cart component. If there is an error like out of stock, a red message will appear.

I used tanstack instead of useEffect and useState for fetching data because it is more efficient, handles caching. It also has built-in support for pagination, and background updates.