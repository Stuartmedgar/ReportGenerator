import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Template, Class, Student, TemplateSection } from '../types';
import SectionRenderer from './report-sections/SectionRenderer';

interface ReportWriterProps {
  template: Template;
  classData: Class;
  students: Student[];
  onBack: () => void;
}

function ReportWriter({ template, classData, students, onBack }: ReportWriterProps) {
  const { saveReport, getReport } = useData();
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [sectionData, setSectionData] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');

  const currentStudent = students[currentStudentIndex];

  // Load saved report data when student changes
  useEffect(() => {
    if (currentStudent) {
      const savedReport = getReport(currentStudent.id, template.id);
      if (savedReport) {
        setSectionData(savedReport.sectionData || {});
        setHasUnsavedChanges(false);
      } else {
        setSectionData({});
        setHasUnsavedChanges(false);
      }
    }
  }, [currentStudent, template.id, getReport]);

  // Update section data
  const updateSectionData = (sectionId: string, data: any) => {
    setSectionData(prev => {
      const newData = {
        ...prev,
        [sectionId]: { ...prev[sectionId], ...data }
      };
      
      // If this is a rating change for a rated comment, lock in a specific comment
      if (data.rating && template.sections.find(s => s.id === sectionId)?.type === 'rated-comment') {
        const section = template.sections.find(s => s.id === sectionId);
        const comments = section?.data?.ratings?.[data.rating];
        if (comments && comments.length > 0 && data.rating !== 'no-comment') {
          // Only pick a new random comment if we don't already have one for this rating
          if (!newData[sectionId].selectedComment || newData[sectionId].lastRating !== data.rating) {
            const randomIndex = Math.floor(Math.random() * comments.length);
            newData[sectionId].selectedComment = comments[randomIndex];
            newData[sectionId].selectedCommentIndex = randomIndex;
            newData[sectionId].lastRating = data.rating;
          }
        }
      }
      
      // Similar logic for assessment comments
      if (data.performance && template.sections.find(s => s.id === sectionId)?.type === 'assessment-comment') {
        const section = template.sections.find(s => s.id === sectionId);
        const comments = section?.data?.comments?.[data.performance];
        if (comments && comments.length > 0 && data.performance !== 'no-comment') {
          if (!newData[sectionId].selectedComment || newData[sectionId].lastPerformance !== data.performance) {
            const randomIndex = Math.floor(Math.random() * comments.length);
            newData[sectionId].selectedComment = comments[randomIndex];
            newData[sectionId].selectedCommentIndex = randomIndex;
            newData[sectionId].lastPerformance = data.performance;
          }
        }
      }
      
      // Similar logic for personalised comments
      if (data.selectedHeading && template.sections.find(s => s.id === sectionId)?.type === 'personalised-comment') {
        const section = template.sections.find(s => s.id === sectionId);
        const comments = section?.data?.comments?.[data.selectedHeading];
        if (comments && comments.length > 0) {
          if (!newData[sectionId].selectedComment || newData[sectionId].lastHeading !== data.selectedHeading) {
            const randomIndex = Math.floor(Math.random() * comments.length);
            newData[sectionId].selectedComment = comments[randomIndex];
            newData[sectionId].selectedCommentIndex = randomIndex;
            newData[sectionId].lastHeading = data.selectedHeading;
          }
        }
      }
      
      // Similar logic for next steps
      if (data.selectedFocus && template.sections.find(s => s.id === sectionId)?.type === 'next-steps') {
        const section = template.sections.find(s => s.id === sectionId);
        const comments = section?.data?.comments?.[data.selectedFocus];
        if (comments && comments.length > 0) {
          if (!newData[sectionId].selectedComment || newData[sectionId].lastFocus !== data.selectedFocus) {
            const randomIndex = Math.floor(Math.random() * comments.length);
            newData[sectionId].selectedComment = comments[randomIndex];
            newData[sectionId].selectedCommentIndex = randomIndex;
            newData[sectionId].lastFocus = data.selectedFocus;
          }
        }
      }
      
      return newData;
    });
    setHasUnsavedChanges(true);
  };

  // Generate report preview
  useEffect(() => {
    if (!currentStudent) return;

    let report = '';
    
    template.sections.forEach(section => {
      const data = sectionData[section.id] || {};
      
      switch (section.type) {
        case 'rated-comment':
          if (data.rating && data.rating !== 'no-comment') {
            // Use the locked-in selected comment if available
            if (data.selectedComment) {
              const processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              report += processedComment + ' ';
            }
          }
          if (data.additionalComment?.trim()) {
            report += data.additionalComment.trim() + ' ';
          }
          break;

        case 'standard-comment':
          // Auto-use the template content if no custom comment is entered
          const standardText = data.comment?.trim() || section.data?.content?.trim() || '';
          if (standardText) {
            const processedComment = standardText.replace(/\[Name\]/g, currentStudent.firstName);
            report += processedComment + ' ';
          }
          break;

        case 'assessment-comment':
          if (data.performance && data.performance !== 'no-comment') {
            // Generate score display with more detailed checking
            let scoreText = '';
            
            console.log('Assessment data:', data); // Debug line
            
            if (data.scoreType === 'percentage' && data.percentage) {
              scoreText = `${data.percentage}%`;
            } else if ((data.scoreType === 'outOf' || !data.scoreType) && data.score && data.maxScore) {
              scoreText = `${data.score}/${data.maxScore}`;
            } else if (data.score && data.maxScore) {
              // Extra fallback
              scoreText = `${data.score}/${data.maxScore}`;
            }
            
            console.log('Generated scoreText:', scoreText); // Debug line

            // Use the locked-in selected comment if available
            if (data.selectedComment) {
              let processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              if (scoreText) {
                processedComment = processedComment.replace(/\[Score\]/g, scoreText);
              } else {
                // If no score entered, remove the [Score] placeholder
                processedComment = processedComment.replace(/\[Score\]/g, '[No score entered]');
              }
              report += processedComment + ' ';
            }
          }
          if (data.additionalComment?.trim()) {
            let processedComment = data.additionalComment.replace(/\[Name\]/g, currentStudent.firstName);
            // Handle score replacement in additional comments too
            let scoreText = '';
            if (data.scoreType === 'percentage' && data.percentage) {
              scoreText = `${data.percentage}%`;
            } else if (data.score && data.maxScore) {
              scoreText = `${data.score}/${data.maxScore}`;
            }
            if (scoreText) {
              processedComment = processedComment.replace(/\[Score\]/g, scoreText);
            } else {
              processedComment = processedComment.replace(/\[Score\]/g, '[No score entered]');
            }
            report += processedComment.trim() + ' ';
          }
          break;

        case 'personalised-comment':
          if (data.includeSection !== false && data.personalisedInfo?.trim()) {
            // Use the locked-in selected comment if available
            if (data.selectedComment) {
              let processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              processedComment = processedComment.replace(/\[personalised information\]/g, data.personalisedInfo);
              report += processedComment + ' ';
            }
            
            if (data.additionalComment?.trim()) {
              let processedComment = data.additionalComment.replace(/\[Name\]/g, currentStudent.firstName);
              processedComment = processedComment.replace(/\[personalised information\]/g, data.personalisedInfo);
              report += processedComment.trim() + ' ';
            }
          }
          break;

        case 'next-steps':
          if (data.includeSection !== false && data.selectedFocus) {
            // Use the locked-in selected comment if available
            if (data.selectedComment) {
              const processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              report += processedComment + ' ';
            }
            
            if (data.additionalSuggestions?.trim()) {
              const processedComment = data.additionalSuggestions.replace(/\[Name\]/g, currentStudent.firstName);
              report += processedComment.trim() + ' ';
            }
          }
          break;

        case 'optional-additional-comment':
          if (data.showOptional && data.additionalComment?.trim()) {
            const processedComment = data.additionalComment.replace(/\[Name\]/g, currentStudent.firstName);
            report += processedComment + ' ';
          }
          break;

        case 'new-line':
          report += '\n\n';
          break;
      }
    });

    setGeneratedReport(report.trim());
  }, [sectionData, currentStudent, template]);

  // Save report
  const handleSaveReport = () => {
    if (currentStudent) {
      saveReport({
        id: `${currentStudent.id}-${template.id}`,
        studentId: currentStudent.id,
        templateId: template.id,
        classId: classData.id,
        content: generatedReport,
        sectionData: sectionData,
        lastModified: new Date().toISOString()
      });
      setHasUnsavedChanges(false);
    }
  };

  // Navigate between students
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to continue? Your changes will be lost.');
      if (!confirmed) return;
    }

    if (direction === 'prev' && currentStudentIndex > 0) {
      setCurrentStudentIndex(prev => prev - 1);
    } else if (direction === 'next' && currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(prev => prev + 1);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to exit? Your changes will be lost.');
      if (!confirmed) return;
    }
    onBack();
  };

  if (!currentStudent) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p>No students available for report writing.</p>
        <button onClick={onBack} style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '20px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#111827',
              margin: '0 0 4px 0'
            }}>
              Writing Report: {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: 0,
              fontSize: '14px'
            }}>
              {template.name} • {classData.name} • Student {currentStudentIndex + 1} of {students.length}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate('prev')}
              disabled={currentStudentIndex === 0}
              style={{
                backgroundColor: currentStudentIndex === 0 ? '#d1d5db' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous
            </button>
            
            <button
              onClick={handleSaveReport}
              style={{
                backgroundColor: hasUnsavedChanges ? '#10b981' : '#059669',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {hasUnsavedChanges ? 'Save Report' : 'Saved ✓'}
            </button>
            
            <button
              onClick={() => handleNavigate('next')}
              disabled={currentStudentIndex === students.length - 1}
              style={{
                backgroundColor: currentStudentIndex === students.length - 1 ? '#d1d5db' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === students.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
            
            <button
              onClick={handleBack}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        
        {/* Left Column - Report Sections */}
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Report Sections
          </h2>
          
          {/* Student Information */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              Student Information
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              First Name: {currentStudent.firstName}<br/>
              Surname: {currentStudent.lastName}
            </p>
          </div>

          {/* Section Forms */}
          {template.sections.map(section => (
            <SectionRenderer 
              key={section.id}
              section={section}
              sectionData={sectionData}
              updateSectionData={updateSectionData}
            />
          ))}
        </div>

        {/* Right Column - Report Preview */}
        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Report Preview
          </h2>
          
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
            minHeight: '400px',
            fontFamily: 'serif',
            lineHeight: '1.6'
          }}>
            <pre style={{
              fontFamily: 'inherit',
              fontSize: '14px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {generatedReport || 'Report preview will appear here as you fill out the sections...'}
            </pre>
          </div>

          {/* Export Buttons */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => navigator.clipboard.writeText(generatedReport)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              📋 Copy Report
            </button>
            
            <button
              onClick={() => {
                const blob = new Blob([generatedReport], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentStudent.firstName}_${currentStudent.lastName}_Report.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              💾 Download
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportWriter;