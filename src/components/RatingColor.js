import React from "react";
import { Box, Typography } from "@mui/material";

const getColorFromRating = (rating) => {
  // Ensure the rating is within the 1 to 5 range
  const clampedRating = Math.max(1, Math.min(5, rating));

  // Map the rating to a value between 0 and 1
  const normalized = (clampedRating - 1) / 4;

  let red, green;

  // Define the gradient steps (red → orange → yellow → green)
  if (normalized <= 0.33) {
    // Red to Orange
    red = 180;
    green = Math.round(normalized / 0.33 * 100); // Scale green up to 100
  } else if (normalized <= 0.66) {
    // Orange to Yellow
    red = Math.round(180 - ((normalized - 0.33) / 0.33) * 80); // Scale red down to 100
    green = 100 + Math.round(((normalized - 0.33) / 0.33) * 80); // Scale green up to 180
  } else {
    // Yellow to Green
    red = Math.round(100 - ((normalized - 0.66) / 0.34) * 100); // Scale red down to 0
    green = 180;
  }

  // Return the darkened gradient color as an RGB string
  return `rgb(${red}, ${green}, 0)`;
};

const RatingColor = ({ rating }) => {
  const color = getColorFromRating(rating);

  return (
    <Box bgcolor={color} textAlign="center" sx={{paddingX: "4px"}} borderRadius={1}>
      <Typography variant="caption" color="white">{rating}</Typography>
    </Box>
  );
};

export default RatingColor;
