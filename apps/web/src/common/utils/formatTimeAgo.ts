/**
 * Converts a Moment.js "fromNow" output to a custom format.
 *
 * @param timeAgoString - The output of moment(createdAt).fromNow()
 * @returns The formatted time string.
 */
const formatTimeAgo = (timeAgoString: string): string => {
    return timeAgoString
      .replace('minutes', 'min')
      .replace('minute', 'min')
      .replace('hours', 'hr')
      .replace('hour', 'hr')
      .replace('seconds', 'sec')
      .replace('second', 'sec');
  };
  
  export default formatTimeAgo;
  