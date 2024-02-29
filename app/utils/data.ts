import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "Janne",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Ultra Light Harness",
      slug: "ultra-light-harness",
      category: "Harness",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/devers_yidd7m",
      isFeatured: true,
      featuredImage:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/devers_yidd7m",
      price: 105,
      brand: "Petzl",
      rating: 4.03,
      numReviews: 3,
      countInStock: 20,
      description:
        "One of the lightest Harness, made for competition, but also perfect to send the hardest projects out there",
    },
    {
      name: "Rope Original",
      slug: "rope-original",
      category: "Rope",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/ropeOriginal",
      price: 85,
      brand: "B.Diamond",
      rating: 4.1,
      numReviews: 7,
      countInStock: 20,
      description:
        "LightWeight rope designed to help you send your hardest projects",
    },
    {
      name: "Golden Quickdraws",
      slug: "golden-quickdraws",
      category: "Quickdraws",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/quickdraws",
      isFeatured: true,
      featuredImage:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/goldenQuickDrawCover",
      price: 65,
      brand: "B.Diamond",
      rating: 4.02,
      numReviews: 13,
      countInStock: 20,
      description: "Pack of 6 Golden Quickdraws",
    },
    {
      name: "Green Quickdraws",
      slug: "green-quickdraws",
      category: "Quickdraws",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/greenQuickdraws",
      price: 62,
      brand: "Edelrid",
      rating: 4.1,
      numReviews: 6,
      countInStock: 20,
      description: "Pack of 6 Green Quickdraws",
    },
    {
      name: "Orange Rope",
      slug: "orange-rope",
      category: "Rope",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/orangeRope",
      isFeatured: true,
      featuredImage:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/orangeRopeCover",
      price: 85,
      brand: "Beal",
      rating: 4.01,
      numReviews: 4,
      countInStock: 20,
      description: "Smart looking rope, perfect for outdoor climbing",
    },
    {
      name: "Blue Rope",
      slug: "blue-rope",
      category: "Rope",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/BlueRope",
      price: 95,
      brand: "Petzl",
      rating: 4.29,
      numReviews: 8,
      countInStock: 20,
      description: "One of the best ropes on the market",
    },
    {
      name: "Classic Shoes",
      slug: "classic-shoes",
      category: "Shoes",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/shoes",
      price: 110,
      brand: "FiveTen",
      rating: 4.25,
      numReviews: 9,
      countInStock: 20,
      description:
        "Polyvalent climbing shoes that will take you on top of every routes",
    },
    {
      name: "Climbing Chock",
      slug: "climbing-chock",
      category: "Gears",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/coinceur",
      price: 50,
      brand: "Petzl",
      rating: 4.4,
      numReviews: 11,
      countInStock: 20,
      description:
        "Sturdy and durable, it will follow you in all your trad climbs",
    },
    {
      name: "Climbing Helmet",
      slug: "climbing-helmet",
      category: "Helmet",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/climbingHelmet",
      price: 75,
      brand: "Petzl",
      rating: 4.01,
      numReviews: 12,
      countInStock: 20,
      description:
        "No helmet feeling, perfect to send your projects with the safty wearing a helmet",
    },
    {
      name: "Indoor Holds",
      slug: "indoor-holds",
      category: "Holds",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/indoor",
      price: 60,
      brand: "Beal",
      rating: 4.3,
      numReviews: 5,
      countInStock: 20,
      description: "A set of 20 indoor holds",
    },
    {
      name: "Belay 8 Device",
      slug: "belay-device",
      category: "Gears",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/otherBelayDevice",
      price: 87,
      brand: "Beal",
      rating: 4.27,
      numReviews: 7,
      countInStock: 20,
      description: "Classic but reliable belay device",
    },

    {
      name: "Climbing Helmet BD",
      slug: "climbing-helmet-bd",
      category: "Helmet",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/pinkRope",
      price: 78,
      brand: "B.Diamond",
      rating: 4.31,
      numReviews: 7,
      countInStock: 20,
      description:
        "Perfect to send your projects with the safty wearing a helmet without even feeling it",
    },
    {
      name: "Quickdraw BD",
      slug: "quickdraw-bd",
      category: "Quickdraws",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/greyQuickdraw",
      price: 75,
      brand: "B.Diamond",
      rating: 4.11,
      numReviews: 9,
      countInStock: 11,
      description: "Pack of 6 grey Quickdraws",
    },
    {
      name: "Grigri",
      slug: "grigri",
      category: "Gears",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/grigri",
      price: 90,
      brand: "Petzl",
      rating: 4.19,
      numReviews: 8,
      countInStock: 11,
      description: "Best belay device out there !",
    },
    {
      name: "BD Belay Device",
      slug: "bd-belay-device",
      category: "Gears",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/bdBelayDevice",
      price: 85,
      brand: "B.Diamond",
      rating: 4.09,
      numReviews: 6,
      countInStock: 11,
      description:
        "A really great belay device to make your rock climbing safe !",
    },
    {
      name: "Crashpad",
      slug: "Crashpad",
      category: "Crashpad",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/crashpad",
      price: 170,
      brand: "Climb On",
      rating: 4.06,
      numReviews: 3,
      countInStock: 11,
      description: "The best protection for your out door boulder sessions !",
    },
    {
      name: "Scarpa Shoes",
      slug: "scarpa-shoes",
      category: "Shoes",
      image:
        "https://res.cloudinary.com/dtqbattvc/image/upload/f_auto,q_auto/v1/amazona/scarpaShoes",
      price: 125,
      brand: "Scarpa",
      rating: 4.21,
      numReviews: 6,
      countInStock: 6,
      description:
        "Polyvalent climbing shoes that will take you on top of every sports routes",
    },
  ],
};
export default data;
