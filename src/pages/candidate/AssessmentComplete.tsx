import { CheckCircle } from 'lucide-react';

export default function AssessmentComplete() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Submitted!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for completing the assessment. Your submission has been received and will be reviewed shortly.
                </p>
                <p className="text-sm text-gray-500">
                    You may now close this window.
                </p>
            </div>
        </div>
    );
}
