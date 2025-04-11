// components/forum/PendingNotification.tsx
"use client";

import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface PendingNotificationProps {
  type: 'topic' | 'reply';
}

const PendingNotification: React.FC<PendingNotificationProps> = ({ type }) => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 mb-6 animate-fade-in">
      <div className="flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1.5">
            {type === 'topic' ? 'Your topic is pending approval' : 'Your reply is pending approval'}
          </h3>
          <p className="text-yellow-700 dark:text-yellow-400 mb-2">
            {type === 'topic' 
              ? 'Your topic has been submitted for moderation and will be visible to other users after it is approved by a moderator.' 
              : 'Your reply has been submitted for moderation and will be visible to other users after it is approved by a moderator.'}
          </p>
          <div className="flex items-center text-yellow-600 dark:text-yellow-500 text-sm font-medium">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>Typical approval time: 24-48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingNotification;