title: Test math
date: 2017-01-07 15:43:23
tags: math, research
description: Just a test case....
visible: 1
--metadata--
# Test Math

## Math

So, $A = 5$ and $A^{2} = 9$ then $B_{1} = 8$
$f(7) \approx 20.33$.
A longer math:


\begin{align}
\displaystyle{f(x) = d + \frac{a - d}{1 + \Big(\displaystyle\frac{x}{c}\Big)^b}}
\end{align}

```
import Foundation

@objc class Person: Entity {
  var name: String!
  var age:  Int!

  init(name: String, age: Int) {
    /* /* ... */ */
  }

  // Return a descriptive string for this person
  func description(offset: Int = 0) -> String {
    return "\(name) is \(age + offset) years old"
  }
}
```