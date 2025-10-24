import {
  CheckCircle,
  CircleAlert,
  Clock,
  Loader,
  XCircle,
  AlertTriangle,
  CheckCheck,
  CircleCheck,
} from "lucide-react";

const StatusIcon = {
  Pending: <Loader className="text-yellow-500 mr-2" size={16} />,
  Paid: <CheckCircle className="text-green-500 mr-2" size={16} />,
  Received: <CircleCheck className="text-green-500 mr-2" size={16} />,
  Completed: <CheckCheck className="text-emerald-500 mr-2" size={16} />,
  Overdue: <CircleAlert className="text-red-500 mr-2" size={16} />,
  Cancelled: <XCircle className="text-gray-500 mr-2" size={16} />,
  Failed: <AlertTriangle className="text-red-600 mr-2" size={16} />,
  Partial: <Clock className="text-orange-400 mr-2" size={16} />,
};

export default StatusIcon;
