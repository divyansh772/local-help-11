import React, { useEffect, useState } from 'react';
import {
  HardDrive,
  FileText,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  X,
  UploadCloud,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { fetchUrbanFixDriveFiles, DriveFileItem, uploadReceiptToDrive } from '../services/driveService';
import { getAccessToken } from '../services/firebaseAuth';
import { Booking } from '../types';

interface DriveReceiptsModalProps {
  user: User | null;
  onGoogleSignIn: () => void;
  bookings: Booking[];
  onReceiptUploaded: (bookingId: string, fileId: string, url?: string) => void;
}

export const DriveReceiptsModal: React.FC<DriveReceiptsModalProps> = ({
  user,
  onGoogleSignIn,
  bookings,
  onReceiptUploaded,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<DriveFileItem | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [batchResultMsg, setBatchResultMsg] = useState<string | null>(null);

  const loadDriveFiles = async () => {
    const token = getAccessToken();
    if (!token || !user) return;

    setIsLoading(true);
    setError(null);
    try {
      const files = await fetchUrbanFixDriveFiles(token);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching Google Drive files:', err);
      setError(err.message || 'Failed to list Google Drive files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDriveFiles();
    }
  }, [user]);

  const handleSyncAllUnsaved = async () => {
    const token = getAccessToken();
    if (!token || !user) {
      onGoogleSignIn();
      return;
    }

    const unsynced = bookings.filter((b) => !b.driveFileId);
    if (unsynced.length === 0) {
      setBatchResultMsg('All existing booking receipts are already synced to Google Drive!');
      return;
    }

    setBatchSyncing(true);
    setBatchResultMsg(null);
    let successCount = 0;

    for (const b of unsynced) {
      try {
        const res = await uploadReceiptToDrive(b, token);
        onReceiptUploaded(b.id, res.fileId, res.webViewLink);
        successCount++;
      } catch (e) {
        console.error('Batch sync failed for:', b.id, e);
      }
    }

    setBatchSyncing(false);
    setBatchResultMsg(`Successfully synced ${successCount} new receipts to Google Drive.`);
    loadDriveFiles();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <HardDrive className="w-3.5 h-3.5" /> Google Drive Cloud Storage Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Digital Receipts & Warranties
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            All your home service invoices, job records, and 30-day warranty certificates are safely stored directly in your personal Google Drive for tax records, insurance claims, and warranty verifications.
          </p>
        </div>

        <div className="flex-shrink-0">
          {user ? (
            <button
              id="refresh-drive-files-btn"
              onClick={loadDriveFiles}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors backdrop-blur-sm border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Checking Drive...' : 'Refresh Drive'}</span>
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-bold transition-all shadow-md"
            >
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Connect Google Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* If user is not authenticated */}
      {!user ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Connect Your Google Account
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            Link your Google Drive with the official Google Drive file permission. UrbanFix will automatically generate and back up verified HTML invoices with OTP signatures whenever you book.
          </p>
          <button
            onClick={onGoogleSignIn}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow"
          >
            <span>Sign in with Google to Connect</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status and Action Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Connected to Google Drive: {user.email}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Scope: <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">https://www.googleapis.com/auth/drive.file</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="batch-sync-drive-btn"
                onClick={handleSyncAllUnsaved}
                disabled={batchSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{batchSyncing ? 'Syncing...' : 'Sync All Pending Receipts'}</span>
              </button>
            </div>
          </div>

          {batchResultMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
              {batchResultMsg}
            </div>
          )}

          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Google Drive Access Notice</p>
                <p className="text-[11px] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Files List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Local Help Receipts in Your Google Drive ({driveFiles.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Target query: name contains 'LocalHelp'
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                Querying your Google Drive...
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-medium text-slate-700">No Local Help receipts found in your Drive yet.</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Click "Sync All Pending Receipts" above or book a new service to automatically create your first digital receipt!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{file.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {file.createdTime ? new Date(file.createdTime).toLocaleString() : 'Recent'} • HTML Document
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <span>Open in Google Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
