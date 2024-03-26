// ./src/plugins/ai-filler/admin/src/components/StartButton.js

import React from 'react';
import { Button } from '@strapi/design-system/Button';

const StartButton = ({ onStart }) => (
  <Button onClick={onStart}>Start Filling Data</Button>
);

export default StartButton;
