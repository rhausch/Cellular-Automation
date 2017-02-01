'use strict';

angular.module('cellautoApp')

    .controller('IndexController', ['$scope', function($scope) {

    }])

    .controller('ConwayController', ['$scope', '$element', function($scope, $element) {

        $scope.gameBoard = {
            height : 40,
            width: 80,
            squares: {},

            getState: function (x, y) {
                var count = 0;

                count += this.squares[(x + 1 + this.width) % this.width][(y + 1 + this.height) % this.height];
                count += this.squares[(x + 1 + this.width) % this.width][(y - 0 + this.height) % this.height];
                count += this.squares[(x + 1 + this.width) % this.width][(y - 1 + this.height) % this.height];

                count += this.squares[(x - 0 + this.width) % this.width][(y + 1 + this.height) % this.height];
                count += this.squares[(x - 0 + this.width) % this.width][(y - 1 + this.height) % this.height];

                count += this.squares[(x - 1 + this.width) % this.width][(y + 1 + this.height) % this.height];
                count += this.squares[(x - 1 + this.width) % this.width][(y - 0 + this.height) % this.height];
                count += this.squares[(x - 1 + this.width) % this.width][(y - 1 + this.height) % this.height];

                if (count === 3 || (this.squares[x][y] && count === 2)) {
                    return 1;
                }

                return 0;
            },

            step : function() {
                var newBoard = this.getEmptyBoard(this.width, this.height);
                for (var i = 0; i < this.width; i += 1) {
                    for (var j = 0; j < this.height; j += 1) {
                        newBoard[i][j] = this.getState(i, j);
                    }
                }
                this.squares = newBoard;
            },

            getEmptyBoard : function (sizeX, sizeY) {
                var newBoard = new Array(sizeX);
                for (var i = 0; i < sizeX; i += 1) {
                    newBoard[i] = new Array(sizeY);
                    for (var j = 0; j < sizeY; j += 1) {
                        newBoard[i][j] = 0;
                    }
                }
                return newBoard;
            },

            clear : function () {
                this.squares = this.getEmptyBoard(this.width, this.height);
            },

            toggle : function (x, y) {

                if (this.squares) {
                    if (this.squares[x][y] === 0) {
                        this.squares[x][y] = 1;
                    } else {
                        this.squares[x][y] = 0;
                    }
                }
            },

            resize : function (newWidth, newHeight) {
                var newBoard = this.getEmptyBoard(newWidth, newHeight);
                if (this.squares !== {}) {
                    for (var i = 0; i < newWidth && i < this.width; i += 1) {
                        for (var j = 0; j < newHeight && j < this.height; j += 1) {
                            newBoard[i][j] = this.squares[i][j];
                        }
                    }
                }
                this.squares = newBoard;
                this.width = newWidth;
                this.height = newHeight;
            }

        };

        $scope.size = 20;

        $scope.running = 0;

        $scope.timer = {};
        $scope.freq = 100;

        $scope.board = $element.find('canvas')[0].getContext('2d');

        $scope.fpsCount = 0;

        $scope.fps = {
            startTime : 0,
            frameNumber : 0,
            getFPS : function() {
                this.frameNumber++;
                var d = new Date().getTime();
                var currentTime = (d - this.startTime) / 1000;
                var result = Math.floor((this.frameNumber / currentTime));

                if (currentTime > 1) {
                    this.startTime = new Date().getTime();
                    this.frameNumber = 0;
                }
                return result;

            }
        };

        $scope.start = function () {
            $scope.running = !$scope.running;
        };

        $scope.rand = function() {
            for (var i = 0; i < 1000 / $scope.size; i += 1) {
                var x = Math.floor(Math.random() * $scope.gameBoard.width);
                var y = Math.floor(Math.random() * $scope.gameBoard.height);
                $scope.gameBoard.squares[x][y] = 1;
            }
        };

        $scope.drawBoard = function() {
            var i;

            $scope.board.clearRect(0, 0, $scope.gameBoard.width * $scope.size, $scope.gameBoard.height * $scope.size);

            $scope.board.strokeStyle = 'grey';
            $scope.board.beginPath();
            if ($scope.size > 4) {
                for (i = 0; i <= $scope.gameBoard.width; i += 1) {
                    $scope.board.moveTo(i * $scope.size, 0);
                    $scope.board.lineTo(i * $scope.size, $scope.gameBoard.height * $scope.size);
                }
                for (i = 0; i <= $scope.gameBoard.height; i += 1) {
                    $scope.board.moveTo(0, i * $scope.size);
                    $scope.board.lineTo($scope.gameBoard.width * $scope.size, i * $scope.size);
                }
            } else {
                $scope.board.moveTo(0, 0);
                $scope.board.lineTo($scope.gameBoard.width * $scope.size, 0);
                $scope.board.lineTo($scope.gameBoard.width * $scope.size, $scope.gameBoard.height * $scope.size);
                $scope.board.lineTo(0, $scope.gameBoard.height * $scope.size);
                $scope.board.closePath();
            }
            $scope.board.stroke();

            $scope.board.fillStyle = 'black';
            for (i = 0; i < $scope.gameBoard.width; i += 1) {
                for (var j = 0; j < $scope.gameBoard.height; j += 1) {
                    $scope.board.beginPath();
                    if ($scope.gameBoard.squares[i][j] === 1) {
                        $scope.board.fillRect(i * $scope.size, j * $scope.size, $scope.size, $scope.size);
                    }
                }
            }

            $scope.fpsCount = $scope.fps.getFPS();
            //console.log($scope.fpsCount); //TODO: Fix fps display. Only updates on button click.
        };

        $scope.$watch('size', function () {
            var width = Math.floor(1500.0 / $scope.size);
            var height = Math.floor(1000.0 / $scope.size);
            console.log('new size = ' + width + ' ' + height);
            $scope.gameBoard.resize(width, height);
        });

        $scope.boardClick = (function (e) {
            var x = Math.floor(e.offsetX / $scope.size);
            var y = Math.floor(e.offsetY / $scope.size);

            $scope.gameBoard.toggle(x, y);
        });

        $scope.step = function () {
            $scope.gameBoard.step();
        };

        $scope.tick = function () {
            $scope.timer = setTimeout($scope.tick, 1000.0 / $scope.freq);
            if ($scope.running) {
                $scope.gameBoard.step();
            }
            $scope.drawBoard();
        };

        $scope.clearBoard = function () {
            var width = Math.floor(1500.0 / $scope.size);
            var height = Math.floor(1000.0 / $scope.size);

            console.log('new size = ' + width + ' ' + height);
            $scope.gameBoard.clear();
            $scope.gameBoard.resize(width, height);
            $scope.tick();
        };

        console.log("Initializing");
        $scope.clearBoard();
        console.log("Board cleared");


    }])

    .controller('NeighbourhoodsController', ['$scope', '$element', function($scope, $element) {

        $scope.gameBoard = {
            height : 10,
            width: 10,
            squares: {},

            isHappy: function (x, y) {
                var count = 0;
                var type = this.squares[x][y];

                count += this.squares[(x + 1 + this.width) % this.width][(y + this.height) % this.height] === type;
                count += this.squares[(x + this.width) % this.width][(y + 1 + this.height) % this.height] === type;
                count += this.squares[(x + this.width) % this.width][(y - 1 + this.height) % this.height] === type;
                count += this.squares[(x - 1 + this.width) % this.width][(y + this.height) % this.height] === type;

                if ($scope.corners) {
                    count += this.squares[(x + 1 + this.width) % this.width][(y + 1 + this.height) % this.height] === type;
                    count += this.squares[(x + 1 + this.width) % this.width][(y - 1 + this.height) % this.height] === type;
                    count += this.squares[(x - 1 + this.width) % this.width][(y + 1 + this.height) % this.height] === type;
                    count += this.squares[(x - 1 + this.width) % this.width][(y - 1 + this.height) % this.height] === type;
                }

                if (count >= $scope.neighbours) {
                    return 1;
                }

                return 0;
            },

            step : function() {
                var newBoard = this.getEmptyBoard(this.width, this.height);
                var toMove = [];
                for (var i = 0; i < this.width; i += 1) {
                    for (var j = 0; j < this.height; j += 1) {
                        if (this.isHappy(i, j)) {
                            newBoard[i][j] = this.squares[i][j];
                        } else {
                            toMove.push({x: i, y: j, type: this.squares[i][j]});
                        }
                    }
                }
                while (toMove.length > 0) {
                    var cell = toMove.pop();
                    var x = Math.floor(Math.random() * $scope.gameBoard.width);
                    var y = Math.floor(Math.random() * $scope.gameBoard.height);

                    while (newBoard[x][y] != 0) {
                        x += 1;
                        if (x >= this.width) {
                            x = 0;
                            y += 1;
                            if (y >= this.height) {
                                y = 0;
                            }
                        }
                    }
                    newBoard[x][y] = cell.type;
                }

                this.squares = newBoard;
            },

            getEmptyBoard : function (sizeX, sizeY) {
                var newBoard = new Array(sizeX);
                for (var i = 0; i < sizeX; i += 1) {
                    newBoard[i] = new Array(sizeY);
                    for (var j = 0; j < sizeY; j += 1) {
                        newBoard[i][j] = 0;
                    }
                }
                return newBoard;
            },

            moveIn : function (x, y, type) {
                while (this.squares[x][y] != 0) {
                    x += 1;
                    if (x >= this.width) {
                        x = 0;
                        y += 1;
                        if (y >= this.height) {
                            y = 0;
                        }
                    }
                }
                this.squares[x][y] = type;
            },

            clear : function () {
                this.squares = this.getEmptyBoard(this.width, this.height);
            },

            toggle : function (x, y) {

                if (this.squares) {
                    if (this.squares[x][y] === 0) {
                        this.squares[x][y] = 1;
                    } else if (this.squares[x][y] === 1) {
                        this.squares[x][y] = 2;
                    } else {
                        this.squares[x][y] = 0;
                    }
                }
            },

            resize : function (newWidth, newHeight) {
                var newBoard = this.getEmptyBoard(newWidth, newHeight);
                if (this.squares !== {}) {
                    for (var i = 0; i < newWidth && i < this.width; i += 1) {
                        for (var j = 0; j < newHeight && j < this.height; j += 1) {
                            newBoard[i][j] = this.squares[i][j];
                        }
                    }
                }
                this.squares = newBoard;
                this.width = newWidth;
                this.height = newHeight;
            }

        };

        $scope.size = 64;

        $scope.occupancy = 90;
        $scope.neighbours = 3;

        $scope.running = 0;

        $scope.corners = true;

        $scope.timer = {};
        $scope.freq = 100;

        $scope.board = $element.find('canvas')[0].getContext('2d');

        $scope.fpsCount = 0;

        $scope.fps = {
            startTime : 0,
            frameNumber : 0,
            getFPS : function() {
                this.frameNumber++;
                var d = new Date().getTime();
                var currentTime = (d - this.startTime) / 1000;
                var result = Math.floor((this.frameNumber / currentTime));

                if (currentTime > 1) {
                    this.startTime = new Date().getTime();
                    this.frameNumber = 0;
                }
                return result;

            }
        };

        $scope.start = function () {
            $scope.running = !$scope.running;
        };

        $scope.rand = function() {
            var cells = $scope.gameBoard.width * $scope.gameBoard.height;
            var count = (cells * ($scope.occupancy / 100.0)) / 2;

            console.log(cells);
            console.log(count);

            $scope.gameBoard.clear();
            for (var i = 0; i < count; i += 1) {
                $scope.gameBoard.moveIn(Math.floor(Math.random() * $scope.gameBoard.width), Math.floor(Math.random() * $scope.gameBoard.height), 1)
                $scope.gameBoard.moveIn(Math.floor(Math.random() * $scope.gameBoard.width), Math.floor(Math.random() * $scope.gameBoard.height), 2)
            }
            $scope.drawBoard();

        };

        $scope.drawBoard = function() {
            var i;

            $scope.board.clearRect(0, 0, $scope.gameBoard.width * $scope.size, $scope.gameBoard.height * $scope.size);

            $scope.board.strokeStyle = 'grey';
            $scope.board.beginPath();
            if ($scope.size > 4) {
                for (i = 0; i <= $scope.gameBoard.width; i += 1) {
                    $scope.board.moveTo(i * $scope.size, 0);
                    $scope.board.lineTo(i * $scope.size, $scope.gameBoard.height * $scope.size);
                }
                for (i = 0; i <= $scope.gameBoard.height; i += 1) {
                    $scope.board.moveTo(0, i * $scope.size);
                    $scope.board.lineTo($scope.gameBoard.width * $scope.size, i * $scope.size);
                }
            } else {
                $scope.board.moveTo(0, 0);
                $scope.board.lineTo($scope.gameBoard.width * $scope.size, 0);
                $scope.board.lineTo($scope.gameBoard.width * $scope.size, $scope.gameBoard.height * $scope.size);
                $scope.board.lineTo(0, $scope.gameBoard.height * $scope.size);
                $scope.board.closePath();
            }
            $scope.board.stroke();

            $scope.board.fillStyle = 'blue';
            for (i = 0; i < $scope.gameBoard.width; i += 1) {
                for (var j = 0; j < $scope.gameBoard.height; j += 1) {
                    $scope.board.beginPath();
                    if ($scope.gameBoard.squares[i][j] === 1) {
                        $scope.board.fillRect(i * $scope.size, j * $scope.size, $scope.size, $scope.size);
                    }
                }
            }

            $scope.board.fillStyle = 'green';
            for (i = 0; i < $scope.gameBoard.width; i += 1) {
                for (var j = 0; j < $scope.gameBoard.height; j += 1) {
                    $scope.board.beginPath();
                    if ($scope.gameBoard.squares[i][j] === 2) {
                        $scope.board.fillRect(i * $scope.size, j * $scope.size, $scope.size, $scope.size);
                    }
                }
            }


            $scope.fpsCount = $scope.fps.getFPS();
            //console.log($scope.fpsCount); //TODO: Fix fps display. Only updates on button click.
        };

        $scope.$watch('size', function () {
            var width = Math.floor(500.0 / $scope.size);
            var height = Math.floor(500.0 / $scope.size);
            console.log('new size = ' + width + ' ' + height);
            $scope.gameBoard.resize(width, height);
        });

        $scope.boardClick = (function (e) {
            var x = Math.floor(e.offsetX / $scope.size);
            var y = Math.floor(e.offsetY / $scope.size);

            $scope.gameBoard.toggle(x, y);
        });

        $scope.step = function () {
            $scope.gameBoard.step();
        };

        $scope.tick = function () {
            $scope.timer = setTimeout($scope.tick, 1000.0 / $scope.freq);
            if ($scope.running) {
                $scope.gameBoard.step();
            }
            $scope.drawBoard();
        };

        $scope.clearBoard = function () {
            var width = Math.floor(500.0 / $scope.size);
            var height = Math.floor(500.0 / $scope.size);

            console.log('new size = ' + width + ' ' + height);
            $scope.gameBoard.clear();
            $scope.gameBoard.resize(width, height);
            $scope.tick();
        };

        console.log("Initializing");
        $scope.clearBoard();
        console.log("Board cleared");


    }])


;

