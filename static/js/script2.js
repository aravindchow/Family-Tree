const img_height = 50;
const img_width = 100;

// stratifies data, provides x and y coord
var dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(family_tree_data);

var spouse_dataStructure = d3
  .stratify()
  .id(function (d) {
    return d.name;
  }) //the name in "d.name" needs to match data
  .parentId(function (d) {
    return d.parent;
  })(spouse_data);

const tree_y = 400;
const tree_x = 1000;

// creates a frame, anything past is cutt off, all elements shifted ↓ & → 50 px

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", tree_x)
  .attr("height", 2 * tree_y)
  .append("g")
  .attr("transform", "translate(100,100)");

var defs = svg.append("defs");
var spouse_defs = svg.append("defs");

// painting size, careful don't go too far, should not be bigger tha canvas size or svg size
var treeStructure = d3.tree().size([tree_x, tree_y]);

svg.call(
  d3
    .zoom()
    //.extent([[0,0],[width, height]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed)
);

function zoomed() {
  svg.attr("transform", d3.event.transform);
}

// //??? doesn't seem necessary according to prints of descendants and links
// // But if we dont use it, the code doent work
var spouse_information = treeStructure(spouse_dataStructure);
var information = treeStructure(dataStructure);

defs
  .selectAll(".family-image")
  .data(family_tree_data)
  .enter()
  .append("pattern")
  .attr("class", "family-image")
  .attr("id", function (d) {
    return d.img;
  })
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", function (d) {
    return "/static/images/" + d.img;
  });

spouse_defs
  .selectAll(".family-image")
  .data(spouse_data)
  .enter()
  .append("pattern")
  .attr("class", "family-image")
  .attr("id", function (d) {
    return d.img;
  })
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("height", 1)
  .attr("width", 1)
  .attr("preserveAspectRatio", "none")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("xlink:href", function (d) {
    return "/static/images/" + d.img;
  });
// // Path drawing stuff??? why 20 -> variablize later with once we decide dimensions of buttons
var connections = svg.append("g").selectAll("path").data(information.links());
connections
  .enter()
  .append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-opacity", 1)
  .attr("d", function (d) {
    if (d.source.data.spouse == "") {
      return (
        "M " +
        d.source.x +
        "," +
        d.source.y +
        " v " +
        (img_height - 10) +
        " H " +
        d.target.x + //- img_height / 2 +
        " V" +
        d.target.y
      );
    } else {
      return (
        "M " +
        (d.source.x + img_width * 0.75) +
        "," +
        d.source.y +
        " v " +
        (img_height - 10) +
        " H " +
        d.target.x + //- img_height / 2 +
        " V" +
        d.target.y
      );
    }
  });

var spouse_lines = svg
  .append("g")
  .selectAll("circle")
  .data(spouse_information.descendants());

spouse_lines
  .enter()
  .append("circle")
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .attr("height", 0.5)
  .attr("width", 150)
  .attr("class", "rect")
  .attr("stroke", "red")
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });

var rectangles = svg
  .append("g")
  .selectAll("rect")
  .data(information.descendants());
rectangles
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return d.x - img_width / 2;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "rect")
  .attr("fill", function (d) {
    return "url(#" + d.data.img + ")";
  })
  .on("click", function (d) {
    console.log(d.data.img);
  });

var spouseRectangles = svg
  .append("g")
  .selectAll("rect")
  .data(spouse_information.descendants());
spouseRectangles
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return d.x + img_width;
  })
  .attr("y", function (d) {
    return d.y - img_height / 2;
  })
  .attr("height", img_height)
  .attr("width", img_width)
  .attr("class", "rect")
  .attr("fill", function (d) {
    return "url(#" + d.data.img + ")";
  })
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });

// Names
var names = svg.append("g").selectAll("text").data(information.descendants());
names
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  });

var spouse_names = svg
  .append("g")
  .selectAll("text")
  .data(spouse_information.descendants());
spouse_names
  .enter()
  .append("text")
  .text(function (d) {
    return d.data.name;
  })
  .attr("x", function (d) {
    return d.x + img_width * 1.5;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .classed("hide", function (d) {
    if (d.data.name.includes("_spouse")) return true;
    else return false;
  });

// DRAG AND DROP SHIT
$(document).ready(function () {
  $(".droparea")
    .on("dragover", function (e) {
      e.preventDefault();
    })
    .on("drop", function (e) {
      e.preventDefault();
      var files = e.originalEvent.dataTransfer.files;
      console.log(files[0]);
    });
});
