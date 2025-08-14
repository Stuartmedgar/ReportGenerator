import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function AllReportsViewer() {
  const { classId } = useParams<{ classId: string }>();
  const { state } = useData();

  // Find the class and reports
  const classData = state.classes.find(c => c.id === classId);
  const classReports = state.reports.filter(r => r.classId === classId);
  
  if (!classData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Class not found</h1>
        <Link to="/view-reports">Back to View Reports</Link>
      </div>
    );
  }

  // Get students with reports, sorted by last name
  const studentsWithReports = classData.students?.filter(student => 
    classReports.some(report => report.studentId === student.id)
  ).sort((a, b) => a.lastName.localeCompare(b.lastName)) || [];

  // Get reports with student info
  const reportsWithStudents = studentsWithReports.map(student => {
    const report = classReports.find(r => r.studentId === student.id);
    return { student, report };
  }).filter(item => item.report);

  // Export functions
  const handleCopyAllReports = () => {
    const allReportsText = reportsWithStudents.map(({ student, report }) => 
      `${student.firstName} ${student.lastName}\n\n${report!.content}\n\n`
    ).join('\n');
    
    navigator.clipboard.writeText(allReportsText);
    alert('All reports copied to clipboard!');
  };

  const handleDownloadAllReports = () => {
    const allReportsText = reportsWithStudents.map(({ student, report }) => 
      `${student.firstName} ${student.lastName}\n\n${report!.content}\n\n`
    ).join('\n');
    
    const blob = new Blob([allReportsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classData.name}_All_Reports.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const totalWords = reportsWithStudents.reduce((total, { report }) => 
    total + (report!.content.split(' ').length), 0
  );

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            All Reports - {classData.name}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 0,
            fontSize: '14px'
          }}>
            {reportsWithStudents.length} reports • {totalWords} total words
          </p>
        </div>
        <Link 
          to={`/view-reports/${classId}`}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Class Reports
        </Link>
      </div>

      {/* Actions Bar */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 4px 0'
          }}>
            Export All Reports
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Copy or download all {reportsWithStudents.length} reports in one document
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCopyAllReports}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 Copy All
          </button>
          
          <button
            onClick={handleDownloadAllReports}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            💾 Download All
          </button>
        </div>
      </div>

      {/* All Reports Display */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px'
      }}>
        {reportsWithStudents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              No Reports Available
            </h3>
            <p style={{ margin: 0 }}>
              No completed reports found for this class.
            </p>
          </div>
        ) : (
          <div>
            {reportsWithStudents.map(({ student, report }, index) => (
              <div key={student.id}>
                {/* Student Name Header */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 8px 0'
                  }}>
                    {student.firstName} {student.lastName}
                  </h2>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <span>📅 {new Date(report!.updatedAt).toLocaleDateString()}</span>
                    <span>📄 {report!.content.split(' ').length} words</span>
                    <span>👤 Student {index + 1} of {reportsWithStudents.length}</span>
                  </div>
                </div>

                {/* Report Content */}
                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#374151',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '32px',
                  paddingLeft: '16px'
                }}>
                  {report!.content}
                </div>

                {/* Separator between reports (except for last one) */}
                {index < reportsWithStudents.length - 1 && (
                  <div style={{
                    borderTop: '3px solid #e5e7eb',
                    margin: '32px 0',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      padding: '0 16px',
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontWeight: '600'
                    }}>
                      • • •
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {reportsWithStudents.length > 0 && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>📚 {reportsWithStudents.length} reports</span>
            <span>📄 ~{Math.ceil(totalWords / 250)} pages</span>
            <span>✏️ {totalWords} total words</span>
            <span>📊 {Math.round(totalWords / reportsWithStudents.length)} avg words/report</span>
          </div>
        </div>
      )}
    </div>
  );
}