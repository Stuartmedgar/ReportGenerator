import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function ClassReports() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { state } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Find the class
  const classData = state.classes.find(c => c.id === classId);
  
  if (!classData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Class not found</h1>
        <Link to="/view-reports">Back to View Reports</Link>
      </div>
    );
  }

  // Get reports for this class
  const classReports = state.reports.filter(report => report.classId === classId);
  
  // Get students with/without reports
  const studentsWithReports = classData.students?.filter(student => 
    classReports.some(report => report.studentId === student.id)
  ) || [];
  
  const studentsWithoutReports = classData.students?.filter(student => 
    !classReports.some(report => report.studentId === student.id)
  ) || [];

  const handleViewIndividualReport = () => {
    if (!selectedStudentId) {
      alert('Please select a student first');
      return;
    }
    navigate(`/view-reports/${classId}/student/${selectedStudentId}`);
  };

  const handleViewAllReports = () => {
    navigate(`/view-reports/${classId}/all`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
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
            {classData.name} Reports
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 0,
            fontSize: '14px'
          }}>
            {classReports.length} of {classData.students?.length || 0} reports completed
          </p>
        </div>
        <Link 
          to="/view-reports" 
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to View Reports
        </Link>
      </div>

      {/* Report Options */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        
        {/* Individual Report Option */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827',
            margin: '0 0 12px 0'
          }}>
            👤 Individual Report
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            View, edit, copy or export a single student's report
          </p>

          {/* Student Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Select Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Choose a student...</option>
              {studentsWithReports.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ✅
                </option>
              ))}
              {studentsWithoutReports.map(student => (
                <option key={student.id} value={student.id} disabled>
                  {student.firstName} {student.lastName} (No report)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleViewIndividualReport}
            disabled={!selectedStudentId || !studentsWithReports.some(s => s.id === selectedStudentId)}
            style={{
              backgroundColor: (!selectedStudentId || !studentsWithReports.some(s => s.id === selectedStudentId)) ? '#d1d5db' : '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (!selectedStudentId || !studentsWithReports.some(s => s.id === selectedStudentId)) ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            View Individual Report
          </button>
        </div>

        {/* All Reports Option */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827',
            margin: '0 0 12px 0'
          }}>
            📚 All Reports
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            View all completed reports for this class in one document
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              <div>✅ Reports completed: {studentsWithReports.length}</div>
              <div>❌ Reports missing: {studentsWithoutReports.length}</div>
              <div>📄 Total pages: ~{classReports.length * 2}</div>
            </div>
          </div>

          <button
            onClick={handleViewAllReports}
            disabled={classReports.length === 0}
            style={{
              backgroundColor: classReports.length === 0 ? '#d1d5db' : '#10b981',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: classReports.length === 0 ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            View All Reports
          </button>
        </div>
      </div>

      {/* Student Status Overview */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827',
          margin: '0 0 16px 0'
        }}>
          📊 Class Report Status
        </h3>
        
        <div style={{ display: 'flex', gap: '32px' }}>
          
          {/* Students with Reports */}
          {studentsWithReports.length > 0 && (
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#166534',
                margin: '0 0 8px 0'
              }}>
                ✅ Reports Completed ({studentsWithReports.length})
              </h4>
              <div style={{ 
                maxHeight: '200px', 
                overflow: 'auto',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                padding: '8px'
              }}>
                {studentsWithReports.map(student => {
                  const report = classReports.find(r => r.studentId === student.id);
                  return (
                    <div key={student.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 8px',
                      fontSize: '13px',
                      borderBottom: '1px solid #bbf7d0'
                    }}>
                      <span>{student.firstName} {student.lastName}</span>
                      <span style={{ color: '#6b7280', fontSize: '11px' }}>
                        {report ? new Date(report.updatedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students without Reports */}
          {studentsWithoutReports.length > 0 && (
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#dc2626',
                margin: '0 0 8px 0'
              }}>
                ❌ Reports Missing ({studentsWithoutReports.length})
              </h4>
              <div style={{ 
                maxHeight: '200px', 
                overflow: 'auto',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '8px'
              }}>
                {studentsWithoutReports.map(student => (
                  <div key={student.id} style={{
                    padding: '4px 8px',
                    fontSize: '13px',
                    borderBottom: '1px solid #fecaca'
                  }}>
                    {student.firstName} {student.lastName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}