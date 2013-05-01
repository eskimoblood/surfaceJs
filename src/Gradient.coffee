calcColorArray = (colors, stepSize) ->
  for i in [0..stepSize]
    colorsBetween(colors, i / stepSize)

colorBetween = (startColor, endColor, step) ->
  c = calcColor(startColor, endColor, step)
  c(24) + c(16) + c(8) + c(0)

calcColor = (startColor, endColor, step) ->
  (bit) ->
    start = startColor >> bit & 0xFF
    end = endColor >> bit & 0xFF
    (start + (end - start) * step) << bit

colorsBetween = (colors, step) ->
  if (step <= 0)
    colors[0];

  length = colors.length
  if (step >= 1)
    colors[length - 1]

  a =  Math.floor(length * step)
  f = 1 / length
  newStep = (step - (a * f)) / f;
  nextA = a + 1;
  if (nextA >= length)
    nextA = 0;
  colorBetween(colors[a], colors[nextA], newStep);

