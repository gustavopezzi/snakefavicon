$(document).ready(function() {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    // cell width
    var cw = 1;
    var d;
    var food;
    var score;
    var snake_array;

    
    function init() {
        d = "right";
        create_snake();
        create_food();
        score = 0;

        if (typeof game_loop != "undefined")
            clearInterval(game_loop);
        
        game_loop = setInterval(paint, 60);
    }

    
    function create_snake() {
        var length = 5;
        snake_array = [];
        
        for (var i = length - 1; i >= 0; i--)
            snake_array.push({x: i, y:0});
    }


    function create_food() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        };
    }


    function paint() {
        // paint the background on every frame to avoid the snake trail
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        // pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;

        // increment the positions of the head cell to get the new head position based on movement
        if (d == "right")
            nx++;
        else if (d == "left")
            nx--;
        else if (d == "up")
            ny--;
        else if (d == "down")
            ny++;

        // game over clauses
        if (nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)) {
            init();
            return;
        }

        // if the new head position matches with that of the food create a new head instead of moving the tail
        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            
            // increment the score and create the new food
            score++;
            create_food();
        }
        else {
            // pops out the last cell
            var tail = snake_array.pop();
            tail.x = nx; tail.y = ny;
        }
        
        // puts back the tail as the first cell
        snake_array.unshift(tail);

        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }

        // paint the food
        paint_cell(food.x, food.y);
        
        // change favicon with current canvas content
        changeFavIcon();
    }


    function paint_cell(x, y) {
        ctx.fillStyle = "white";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }


    function check_collision(x, y, array) {
        // this function will check if the provided x/y coordinates exist in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }


    function changeFavIcon() {
        var img = document.createElement('img');
        var link = document.getElementById('favicon').cloneNode(true);
        link.href = canvas.toDataURL('image/png');

        // remove old favicon element
        //var oldFavIcon = document.getElementById("favicon");
        //oldFavIcon.parentNode.removeChild(oldFavIcon);

        // add new favicon
        document.body.appendChild(link);
    }


    // keyboard control
    $(document).keydown(function(e) {
        var key = e.which;
        // adds another clause to prevent reverse gear
        if (key == "37" && d != "right")
            d = "left";
        else if (key == "38" && d != "down")
            d = "up";
        else if (key == "39" && d != "left")
            d = "right";
        else if (key == "40" && d != "up")
            d = "down";
    })


    init();
})