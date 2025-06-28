import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  Save,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubmissions } from '../hooks/useSubmissions';
import FullScreenLoader from './FullScreenLoader';

const EditSubmissionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { user } = authState;
  const { submissions, updateSubmission } = useSubmissions();

  const [formData, setFormData] = useState({
    githubUrl: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Find the submission by ID
  const submission = submissions.find((s) => s.id === id);

  useEffect(() => {
    if (submission) {
      setFormData({
        githubUrl: submission.github_url,
        notes: submission.notes || '',
      });
      setLoading(false);
    } else if (submissions.length > 0) {
      // If submissions are loaded but this one doesn't exist
      setLoading(false);
    }
  }, [submission, submissions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateGithubUrl = (url: string): boolean => {
    const githubUrlPattern =
      /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;
    return githubUrlPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id) {
      setError('You must be logged in to edit a submission');
      return;
    }

    if (!formData.githubUrl.trim()) {
      setError('GitHub URL is required');
      return;
    }

    if (!validateGithubUrl(formData.githubUrl)) {
      setError(
        'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)',
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await updateSubmission(id, {
        github_url: formData.githubUrl.trim(),
        notes: formData.notes.trim() || null,
      });

      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/submissions');
        }, 2000);
      } else {
        setError('Failed to update submission');
      }
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to update submission',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to edit submissions.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <FullScreenLoader message="Loading submission..." />;
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submission Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The submission you're looking for doesn't exist or you don't have
              permission to edit it.
            </p>
            <button
              onClick={() => navigate('/submissions')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Back to Submissions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submission Updated!
            </h2>
            <p className="text-gray-600 mb-6">
              Your submission has been updated successfully.
            </p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/submissions')}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Submissions</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Submission
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Github className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Repository Submission
            </h2>
            <p className="text-gray-600">
              Update your repository information and notes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub URL */}
            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL *
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the full URL of the GitHub repository
              </p>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any specific aspects of the repository you'd like us to focus on..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Tell us what interests you about this repository
              </p>
            </div>

            {/* Status Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    submission.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : submission.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {submission.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Submitted on{' '}
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Update Submission</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubmissionForm;
