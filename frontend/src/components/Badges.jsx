import { getStatusClass, getPriorityClass } from '../utils/helpers';

export const StatusBadge = ({ status }) => (
  <span className={`badge ${getStatusClass(status)}`}>
    {status === 'In Progress' ? '🔄' : status === 'Resolved' ? '✅' : status === 'Closed' ? '🔒' : status === 'Assigned' ? '👤' : '⏳'}
    {' '}{status}
  </span>
);

export const PriorityBadge = ({ priority }) => (
  <span className={`badge ${getPriorityClass(priority)}`}>
    {priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢'}
    {' '}{priority}
  </span>
);
