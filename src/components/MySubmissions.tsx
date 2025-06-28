import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FullScreenLoader from './FullScreenLoader';

interface Submission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const MySubmissions: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch user submissions from database
    // For now, show empty state
    setLoading(false);
  }, []);

  if (loading) {
    return <FullScreenLoader message="Loading submissions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Upload className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          </div>
          <p className="text-gray-600">
            Track your submitted repositories and ideas
          </p>
        </div>

        {/* Content */}
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Submit your first repository or idea to get started
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Submit Repository
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {submission.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {submission.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {submission.submittedAt}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{submission.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
