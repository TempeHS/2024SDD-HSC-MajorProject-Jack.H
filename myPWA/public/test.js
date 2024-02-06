if (window.DeviceOrientationEvent) {
    window.addEventListener(
      "deviceorientation",
      (event) => {
        const rotateDegrees = event.alpha; // alpha: rotation around z-axis
        const leftToRight = event.gamma; // gamma: left to right
        const frontToBack = event.beta; // beta: front back motion
  
        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
      },
      true,
    );
  }
  
  const handleOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
    document.getElementById("scoreDisplay").innerHTML = "Orientation: " + frontToBack;
  };