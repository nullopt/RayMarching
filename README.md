RayMarching
============

This project contains a tester project to explore vector collision (*vectorcollision*) and an implementation project that visualizes the ray marching algorithm (*raymarch*).

As a gamer, this helped me learn about what goes into the games that I play. I've discovered the main differences between Ray Tracing and Ray Marching.

raymarch
------------
**Ray Marching** is an algorithm to get the distance/point of intersection to a shape on the scene without using conventional intersection formula. This is particularly useful for shapes that we don't know how to calulate the point of intersection.
This particular project uses an algorithm called Sphere Tracing.
Sphere Tracing Overview:
  1. Calculate distance to outer of closest shape/object from origin.
  2. Extend ray direction by distance generated in step 1.
  3. Calculate distance to outer of closest shape/object from new end point generated in step 2.
  4. Repeat steps 2-3 until distance to a shape is < `MIN_TOLERANCE` or steps > `MAX_DEPTH_SEARCH` or ray length > `MAX_TOLERANCE`
  
### Implementation: ###
~~~javascript
// perform sphere tracing algorithm
for (let i = 0; i < MAX_DEPTH_SEARCH; i++) {
  // reset origin
  if (i === 0) {
    origin = camera.origin;
  }
  // get point on angle at last distance
  const point = origin.extend(pointOnAngle, dist);
  // calculate closest object to new point
  dist = distanceToScene(point);

  // skip open areas
  if (dist > MAX_TOLERANCE) {
    continue;
  }

  // if we're very close to an object, we've hit
  if (dist < MIN_TOLERANCE) {
    hits.push({ pos: point, dist: dist });
    return;
  }
  // draw debug circles
  if (DEBUG_CIRCLES) {
    drawCircle(camCtx, point, dist);
  }
  // set origin to last point
  origin = point;
}
~~~

vectorcollision
------------
**Vector Collision** allowed me to experiment with ways to detect if a vector collided with another.
* I experimented with the initial idea of looping through all the positions between the origin position and the `MAX_LENGTH` of each ray casted and checking if the distance to each shape is within a certain threshold.
  * This proved to be pretty resource heavy as it would be *O(n²)*
  * ~~~javascript
    const getIntersections = () => {
      const theta = (angle * Math.PI) / 180;
      let x, y;
      for (let i = eye.origin.outerDistance(shapes[0].origin); i <= MAX_LENGTH; i++) {
        x = eye.origin.x + i * Math.cos(theta);
        y = eye.origin.y + i * Math.sin(theta);
        const endPoint = new Vec2(x, y);
        for (let j = 0; j < shapes.length; j++) {
          const s = shapes[j];
          if (s.origin.isInArea(eye.origin)) {
            return;
          }
          if (endPoint.outerDistance(s.origin) < 1 && !s.origin.isInArea(endPoint)) {
            intersects.push(endPoint);
            return;
          }
        }
      }
    };
    ~~~
* I relearnt vector math.
* I ran investigations into OOP programming in JS which proved to be quite useful when paired with ES6 `export`
