Worker DB
=========

Random proof of concept thing of housing a game database inside a web worker.

The demo shows some basic initialisation & querying capabilities. It should be
possible to implement a simulation game with computationally-intensive stuff
inside the worker, freeing up the render thread to do it's work. It may be
possible to spin out more workers as required in future.

To do:

* In-worker map/reduce functionality to trim the dataset before it's sent
back to the main thread. 
* A* routing between db tiles inside the worker. (Note it's an x/y grid)
* Misc, I dunno.
