#!/bin/bash

# Define the list of packages
packages=(
  "axios"
  "react-router-dom"
  "jwt-decode"
)

# Install each package
for package in "${packages[@]}"; do
  echo "Installing $package..."
  npm install "$package"
done

echo "All packages have been installed."
