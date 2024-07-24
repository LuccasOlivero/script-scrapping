const puppeteer = require("puppeteer");

async function formalScrape() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      "https://www.gitman.com/collections/the-gitman-shirt-collection"
    );

    const data = await page.$$eval(".js-product-block", (nodes) => {
      return nodes.map((node) => {
        const name =
          node.querySelector(".products__product-info h2")?.innerText.trim() ??
          "no name";
        const price = node
          .querySelector(
            ".products__product-info .block.products__product-price"
          )
          ?.innerText.trim();

        const imageNode = node.querySelector(".products__product-img");
        let imageUrl = imageNode?.style.backgroundImage || "";
        // Eliminar 'url("' y '")'
        imageUrl = imageUrl.slice(5, -2);
        // En caso de que `data-src` sea más confiable:
        if (!imageUrl && imageNode?.dataset.src) {
          imageUrl = imageNode.dataset.src;
        }
        return { name, price, image: imageUrl };
      });
    });
    await browser.close();

    return data.slice(0, 10);
  } catch (error) {
    console.error("ERROR_FORMAL_SCRAPE", error);
  }
}

async function dressScrape() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      "https://www.grid.com.ar/indumentaria/remeras/hombre/unisex?initialMap=c&initialQuery=indumentaria&map=category-1,category-2,genero,genero"
    );

    const data = await page.$$eval(
      ".vtex-search-result-3-x-galleryItem",
      (nodes) => {
        return nodes.map((node) => {
          const name = node
            .querySelector(".vtex-product-summary-2-x-productBrand")
            ?.innerText.trim();
          const price = node
            .querySelector(".vtex-product-summary-2-x-currencyInteger")
            ?.innerText.trim();

          const imageNode = node.querySelector(
            ".vtex-product-summary-2-x-imageNormal"
          );
          let imageUrl = "";
          if (imageNode) {
            imageUrl = imageNode.getAttribute("src");
          }
          return { name, price, image: imageUrl };
        });
      }
    );

    await browser.close();

    return data.slice(0, 10);
  } catch (error) {
    console.error("ERROR_DRESS_SCRAPE", error);
  }
}

async function lacosteScrape() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.underarmour.com.ar/c/remeras/");

    const data = await page.$$eval(".product", (nodes) => {
      return nodes.map((node) => {
        const name = node.querySelector(".pdp-link")?.innerText.trim();
        const price = node
          .querySelector(".value")
          ?.innerText.trim()
          .replace("Precio reducido de\n", "")
          .replace("\nhasta", "");

        let imageUrl = "";
        const imageNode = node.querySelector(".tile-image");
        if (imageNode) {
          imageUrl = imageNode.getAttribute("src");
        }
        return {
          name,
          price,
          image: `https://www.underarmour.com.ar/${imageUrl}`,
        };
      });
    });

    await browser.close();

    return data.slice(0, 10);
  } catch (error) {
    console.error("ERROR_LACOSTE_SCRAPE", error);
  }
}

async function main() {
  try {
    const dataArray = [];

    const data1 = await lacosteScrape();
    const data2 = await formalScrape();
    const data3 = await dressScrape();

    dataArray.push(...data1, ...data2, ...data3);

    console.log(dataArray);
  } catch (error) {
    console.error("ERROR_COMPLETING_SCRAPE", error);
  }
}

main();
