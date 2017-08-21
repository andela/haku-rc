export function userTour() {
  const intro = introJs();
  intro.setOptions({
    steps: [
      {
        intro: "<h3 class='text-center'>Welcome to Haku RC</h3>"
      },
      {
        intro: "<h4 class='text-center'>Need to search for product(s)?</h4>"
      },
      {
        element: "#userTourSearch",
        intro: "Click here and type a product name in the search field. You will find all related products"
      },
      {
        intro: "<h4 class='text-center'>Want to view the website in your preferred language?</h4>"
      },
      {
        element: "#userTourLanguage",
        intro: "Click here to change to your preferred language"
      },
      {
        element: "#userTourQuickAccess",
        intro: "Click here to access more options"
      },
      {
        element: document.querySelectorAll(".product-grid-item-images")[0],
        intro: "<h4 class='text-center'>Clicking on a product shows you all information about the product</h4>"
      },
      {
        element: document.querySelectorAll(".add-to-cart.block")[0],
        intro: "<h4 class='text-center'>Clicking on `Add to Cart` moves the product to your cart</h4>"
      },
      {
        element: "#userTourCart",
        intro: "Click on the cart symbol to reach your cart."
      },
      {
        element: "#userTour",
        intro: "Need to take a tour again? Just click on the tour button"
      },
      {
        intro: "<h3 class='text-center'>Got it? Continue Shopping!</h3>"
      }
    ]
  });
  intro.start();
}
