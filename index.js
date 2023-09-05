const width = "90vw";
const height = "90vh";

function colourNumberFromCategoryAllocator(increment, categories) {
  return categories.map((category, i) => {
    return { category: category, colourNumber: i * increment };
  });
}

const DisplayGraph = () => {
  document.addEventListener("DOMContentLoaded", () => {
    fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let treemapTitle = "Video Games";
        let treemapDescription = "treemap to show sales of videogames";
        const title = d3
          .select(".title")
          .append("h1")
          .text(treemapTitle)
          .append("h6")
          .text(treemapDescription)
          .attr("id", "description");

        var tooltip = d3
          .select(".graph")
          .append("div")
          .attr("id", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute");

        const svg = d3
          .select(".graph")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        const treemapWidth = svg.node().clientWidth;
        const treemapHeight = svg.node().clientHeight;

        const treemap = d3.treemap();
        treemap.size([treemapWidth, treemapHeight]);
        treemap.padding(3);

        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort(
            (nodeOne, nodeTwo) =>
              nodeTwo.height - nodeOne.height || nodeTwo.value - nodeOne.value
          );

        treemap(root);

        const colour = d3.scaleSequential(d3.interpolateRainbow);
        let colourIncrement = 0.05;
        let categories = [
          ...new Set(root.leaves().map((node) => node.data.category)),
        ];
        let categoriesAndColours = colourNumberFromCategoryAllocator(colourIncrement, categories);

        let tile = svg
          .selectAll("g")
          .data(root.leaves())
          .enter()
          .append("g");

        tile
          .append("rect")
          .attr("id", (d) => d.data.id)
          .attr("class", "tile")
          .attr("x", (d) => d.x0)
          .attr("y", (d) => d.y0)
          .attr("data-name", (d) => d.data.name)
          .attr("data-category", (d) => d.data.category)
          .attr("data-value", (d) => d.data.value)
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0)
          .attr("fill", (d) => {
            let category = categoriesAndColours.filter(
              (category) => category.category == d.data.category
            );
            return colour(category[0].colourNumber);
          })
          .on("mouseover", (event, d) => {
            tooltip
              .attr("data-value", d.data.value)
              .style("opacity", 0.7)
              .style("background-color", "grey")
              .style("left", event.pageX + 20 + "px")
              .style("top", event.pageY - 30 + "px")
              .html(
                `
                  Name: 
                  ${d.data.name} 
                  Category:  
                  ${d.data.category} 
                  Value:
                  ${d.data.value}`
              );
          })
          .on("mouseout", () => {
            tooltip.style("opacity", 0);
          });

        tile
          .append("g")
          .append("text")
          .attr("x", (d) => d.x0 + 5)
          .attr("y", (d) => d.y0 + 20)
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0)
          .text((d) => {
            let nameArr = d.data.name.split(" ");
            let returnArr = "";
            for (let i = 0; i < nameArr.length; i++) {
              returnArr += "\n" + nameArr[i];
            }
            return returnArr;
          });

        const legendWidth = 800;
        const legendHeight = 200;
        let categoryRectangleSizing = 15;
        let legendCategoriesInRow = 4;
        let verticalLegendSpacing = 20;
        let horizontalLegendSpacing = 150;

        const legend = d3
          .select(".graph")
          .append("svg")
          .attr("id", "legend")
          .attr("width", legendWidth)
          .attr("height", legendHeight);

        const legendCategory = legend
          .selectAll("g")
          .data(categories)
          .enter()
          .append("g")
          .attr("transform", (d, i) => {
            return (
              "translate(" +
              (i % legendCategoriesInRow) * horizontalLegendSpacing +
              "," +
              (Math.floor(i / legendCategoriesInRow) * categoryRectangleSizing +
                verticalLegendSpacing * Math.floor(i / legendCategoriesInRow)) +
              ")"
            );
          });

        legendCategory
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("class", "legend-item")
          .attr("fill", function (d) {
            let category = categoriesAndColours.filter(
              (category) => category.category == d
            );
            return colour(category[0].colourNumber);
          });

        legendCategory
          .append("text")
          .attr("x", categoryRectangleSizing + 3)
          .attr("y", categoryRectangleSizing - 2)
          .text((d) => d);
      });
  });
};
