/** default settings for the tic-tac-toe game/grid */
const default_settings = {
	canvas_dimensions: {
		x: 500,
		y: 500,
	},
	grid_dimensions: {
		x: 3,
		y: 3,
	},
	colors: {
		primary_color: "black",
		secondary_color: "white",
	},
	player_1: {
		colors: {
			primary_color: "black",
			secondary_color: "green",
		},
	},
	player_2: {
		colors: {
			primary_color: "black",
			secondary_color: "yellow",
		},
	},
	game_settings: {
		ponts_to_win: 3 /** how many squares/circles a player needs to win */,
	},
};

/**
 * if true, player 1 has to make his turn, else player 2
 */
var player_turn = true;

/**
 * * log of all elements filled out, true for player 1, false for player 2, NaN for not filled out
 * * first is column, second is row
 */
var filled_boxes: boolean[][] = new Array();

/** starts the game */
function start_game(): void {
	// for debugging
	// alert("starting game...");

	// gets the html elements
	var canvas = document.getElementById("canvas") as HTMLCanvasElement;
	var start_button = document.getElementById("start") as HTMLButtonElement;

	var context = canvas.getContext("2d");
	// sets the display for the html elements
	start_button.style.display = "none";
	canvas.style.display = "initial";

	// applies height and width to canvas element (from the default settins)
	canvas.height = default_settings.canvas_dimensions.x;
	canvas.width = default_settings.canvas_dimensions.y;
	// makes the grid
	let box_width = default_settings.canvas_dimensions.x / default_settings.grid_dimensions.x;
	let box_height = default_settings.canvas_dimensions.y / default_settings.grid_dimensions.y;
	for (let index_1 = 0; index_1 < default_settings.grid_dimensions.x; index_1++) {
		filled_boxes.push([]);
		for (let index_2 = 0; index_2 < default_settings.grid_dimensions.y; index_2++) {
			context.beginPath();
			context.rect(box_width * index_2, box_height * index_1, box_width, box_height);
			context.fillStyle = default_settings.colors.primary_color;
			context.fill();
			context.strokeStyle = default_settings.colors.secondary_color;
			context.stroke();
			context.closePath();
			filled_boxes[index_1].push(undefined);
		}
	}
}

/**
 * makes a circle
 * -
 * @param radius the radius of the circle
 * @param center the center x and y coordinates of the circle
 * @param fill_color the color to fill the circle
 * @param stroke_color the color for the border of the circle
 */
function circle(
	radius: number,
	center: { x: number; y: number },
	fill_color = "black",
	stroke_color = "white"
): void {
	// gets the html elements
	var canvas = document.getElementById("canvas") as HTMLCanvasElement;
	var context = canvas.getContext("2d");
	// makes the circle
	context.beginPath();
	context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = fill_color;
	context.strokeStyle = stroke_color;
	// context.lineWidth =
	context.fill();
	context.stroke();
	context.closePath();
}

/**
 * draws a square
 * -
 * @param side the length of the side of the square
 * @param center the center x and y coordinates of the square
 * @param fill_color the color to fill the circle
 * @param stroke_color the color for the border of the circle
 */
function square(
	side: number,
	center: { x: number; y: number },
	fill_color = "black",
	stroke_color = "white"
): void {
	// gets the html elements
	var canvas = document.getElementById("canvas") as HTMLCanvasElement;
	var context = canvas.getContext("2d");
	// calculates the upper_left coordinates from the center coordinates given
	let upper_left = {
		x: center.x - side / 2,
		y: center.y - side / 2,
	};
	// makes the circle
	context.beginPath();
	context.rect(upper_left.x, upper_left.y, side, side);
	context.fillStyle = fill_color;
	context.strokeStyle = stroke_color;
	// context.lineWidth =
	context.fill();
	context.stroke();
	context.closePath();
}

/**
 * makes a square or a cricle depending when and what whas clicked
 * @param event the mouse event when clicked
 */
function canvas_clicked(event: MouseEvent): void {
	// gets the height and width of the boxes for easier calculation
	let box_width = default_settings.canvas_dimensions.x / default_settings.grid_dimensions.x;
	let box_height = default_settings.canvas_dimensions.y / default_settings.grid_dimensions.y;
	// calculates in which box the click was bade and adds the according circle/square
	let click_in_box = {
		x: calculate_click(event.x, event.y)[0],
		y: calculate_click(event.x, event.y)[1],
	};
	if (click_in_box.x < 0 || click_in_box.y < 0) {
		// checks if the click was inside the canvas
		console.error("Window was clicked outside of canvas!");
	} else {
		let box = { row: null, column: null };
		// gets the row
		box.column = Math.floor(
			click_in_box.x /
				(default_settings.canvas_dimensions.x / default_settings.grid_dimensions.x)
		);
		// gets the column
		box.row = Math.floor(
			click_in_box.y /
				(default_settings.canvas_dimensions.y / default_settings.grid_dimensions.y)
		);

		if (typeof filled_boxes[box.column][box.row] != "undefined") {
			// cheks if the box was already filled out, if not, fill it out
			console.error("This field is already filled out!");
		} else {
			filled_boxes[box.column][box.row] = player_turn;
			if (player_turn) {
				// if the player_turn is player1 make squares, else make circles
				square(
					box_width * 0.75,
					{
						x: box.column * box_width + box_width / 2,
						y: box.row * box_height + box_height / 2,
					},
					default_settings.player_1.colors.primary_color,
					default_settings.player_1.colors.secondary_color
				);
			} else {
				circle(
					(box_width / 2) * (1 - 0.25 * 2),
					{
						x: box.column * box_width + box_width / 2,
						y: box.row * box_height + box_height / 2,
					},
					default_settings.player_2.colors.primary_color,
					default_settings.player_2.colors.secondary_color
				);
			}
			// changes the player
			player_turn = !player_turn;

			// checks if someone won
			win_checker();
		}
	}
}

/**
 * calculates the click to a position in the canvas
 * -
 * @param x x position of the click
 * @param y y positon of the click
 */
function calculate_click(x: number, y: number): number[] {
	// gets the html elements
	var canvas = document.getElementById("canvas") as HTMLCanvasElement;
	// calculates x-coordinate in the box
	let in_box_x = x - (window.innerWidth - default_settings.canvas_dimensions.x) / 2;
	let in_box_y = y - (window.innerHeight - default_settings.canvas_dimensions.y) / 2;
	return [in_box_x, in_box_y];
}

/**
 * cheks if either player 1 or player 2 has won
 */
function win_checker(): void {
	/* debugging
	var canvas = document.getElementById("canvas") as HTMLCanvasElement;
	var context = canvas.getContext("2d");
	debugging */
	// gets the height and width of the boxes for easier calculation
	let box_width = default_settings.canvas_dimensions.x / default_settings.grid_dimensions.x;
	let box_height = default_settings.canvas_dimensions.y / default_settings.grid_dimensions.y;
	// checks all columns
	filled_boxes.forEach((column) => {
		for (
			let big_index = 0;
			big_index < column.length - default_settings.game_settings.ponts_to_win + 1;
			big_index++
		) {
			let temp_array: boolean[] = [];
			for (
				let index = big_index;
				index < default_settings.game_settings.ponts_to_win + big_index;
				index++
			) {
				temp_array.push(column[index]);
			}
			// checks if all elements are the same --> this person won
			if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return !item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else {
				// continue with testing
			}
		}
	});

	// cheks all rows
	for (let index_r = 0; index_r < default_settings.grid_dimensions.y; index_r++) {
		// for each row
		for (let index_c = 0; index_c < default_settings.grid_dimensions.x; index_c++) {
			// for each column
			let temp_array: boolean[] = [];
			for (
				let index_b = index_c;
				index_b < default_settings.game_settings.ponts_to_win + index_c &&
				index_b < default_settings.grid_dimensions.x;
				index_b++
			) {
				// for points amount of boxes
				temp_array.push(filled_boxes[index_b][index_r]);
			}
			// checks if all elements are the same --> this person won
			if (temp_array.length < default_settings.game_settings.ponts_to_win) {
				// if there are less values than required to whin, skip
				break;
			}
			if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return !item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else {
				// continue with testing
			}
		}
	}
	// check for diagonals left to right
	for (
		let i2 = 0;
		i2 <= default_settings.grid_dimensions.y - default_settings.game_settings.ponts_to_win;
		i2++
	) {
		for (
			let i1 = 0;
			i1 <= default_settings.grid_dimensions.x - default_settings.game_settings.ponts_to_win;
			i1++
		) {
			let temp_array: boolean[] = [];
			for (
				let i3 = i1, i4 = i2 + default_settings.game_settings.ponts_to_win;
				i3 < default_settings.game_settings.ponts_to_win + i1 && i4 > i2;
				i3++, i4--
			) {
				temp_array.push(filled_boxes[i4 - 1][i3]);
			}
			// checks if all elements are the same --> this person won
			if (temp_array.length < default_settings.game_settings.ponts_to_win) {
				// if there are less values than required to whin, skip
				break;
			}
			if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return !item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else {
				// continue with testing
			}
		}
	}
	// check for diagonals right to left
	for (
		let next_y = 0;
		next_y <= default_settings.grid_dimensions.y - default_settings.game_settings.ponts_to_win;
		next_y++
	) {
		for (
			let next_x = 0;
			next_x <=
			default_settings.grid_dimensions.x - default_settings.game_settings.ponts_to_win;
			next_x++
		) {
			let temp_array: boolean[] = [];
			/* debugging
			context.clearRect(0, 0, canvas.width, canvas.height);
			start_game();
			debugging */
			for (
				let this_x = next_x + default_settings.game_settings.ponts_to_win,
					this_y = next_y + default_settings.game_settings.ponts_to_win;
				this_y > next_y && this_x > next_x;
				this_y--, this_x--
			) {
				temp_array.push(filled_boxes[this_y - 1][this_x - 1]);
				/* debugging
				circle(
					(box_width / 2) * 0.25,
					{
						x: (this_x - 1) * box_width + box_width / 2,
						y: (this_y - 1) * box_height + box_height / 2,
					},
					"green",
					"green"
				);
				debugging */
			}
			// checks if all elements are the same --> this person won
			if (temp_array.length < default_settings.game_settings.ponts_to_win) {
				// if there are less values than required to whin, skip
				break;
			}
			if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else if (
				temp_array.every(function (item: boolean) {
					if (typeof item != "undefined") {
						return !item;
					} else {
						return "";
					}
				})
			) {
				someone_won();
			} else {
				// continue with testing
			}
		}
	}
	// checks if all boxes are filled out
	let first_value = filled_boxes[0][0];
	let all_boxes_checker = true;
	if (typeof first_value != "undefined") {
		filled_boxes.forEach(function (row: boolean[]): void {
			row.forEach(function (box: boolean): void {
				if (typeof box == "undefined") {
					all_boxes_checker = false;
				}
			});
		});
	} else {
		all_boxes_checker = false;
	}
	if (all_boxes_checker) {
		nonody_won();
	}
}

function someone_won(): void {
	if (player_turn) {
		alert("Player 2 won!");
	} else {
		alert("Player 1 won!");
	}
	location.reload();
}

function nonody_won(): void {
	alert("Nobody Won!");
	location.reload();
}
