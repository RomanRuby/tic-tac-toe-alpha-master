/**
 * Created by roman on 12.10.17.
 */
import { alphaBetaMinimax } from 'main.js';

onmessage = function(e) {
  console.log('Message received from main script');
  let workerResult = alphaBetaMinimax(e.data[0],e.data[1],e.data[2],e.data[3]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
};