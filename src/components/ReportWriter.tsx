import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Template, Class, Student } from '../types';
import SectionRenderer from './report-sections/SectionRenderer';

interface ReportWriterProps {
  template: Template;
  classData: Class;
  students: Student[];
  onBack: () => void;
}

export default function ReportWriter({ template, classData, students, onBack }: ReportWriterProps) {
  const { saveReport, getReport } = useData();
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [sectionData, setSectionData] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentStudent = students[currentStudentIndex];

  // Load existing report data when student changes
  useEffect(() => {
    if (currentStudent) {
      const existingReport = getReport(currentStudent.id, template.id);
      if (existingReport?.sectionData) {
        setSectionData(existingReport.sectionData);
      } else {
        setSectionData({});
      }
      setHasUnsavedChanges(false);
    }
  }, [currentStudent, template.id, getReport]);

  // Update section data
  const updateSectionData = (sectionId: string, data: any) => {
    setSectionData(prev => {
      const newData = {
        ...prev,
        [sectionId]: { ...prev[sectionId], ...data }
      };
      
      // If this is a rated comment and rating is being set, lock in a random comment
      const section = template.sections.find(s => s.id === sectionId);
      if (section?.type === 'rated-comment' && data.rating && data.rating !== 'no-comment') {
        const comments = section.data?.ratings?.[data.rating];
        if (comments && comments.length > 0 && !newData[sectionId].selectedComment) {
          const randomIndex = Math.floor(Math.random() * comments.length);
          newData[sectionId].selectedComment = comments[randomIndex];
          newData[sectionId].selectedCommentIndex = randomIndex;
        }
      }
      
      setHasUnsavedChanges(true);
      return newData;
    });
  };

  // Generate report content
  const generateReportContent = () => {
    let content = '';
    
    template.sections.forEach(section => {
      const data = sectionData[section.id] || {};
      
      // Skip if section is excluded
      if (data.exclude) {
        return;
      }
      
      switch (section.type) {
        case 'rated-comment':
          if (data.rating && data.rating !== 'no-comment') {
            // Use the locked-in selected comment if available
            if (data.selectedComment) {
              const processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              content += processedComment + ' ';
            } else {
              // If no selected comment, try to get from template data
              const comments = section.data?.ratings?.[data.rating];
              if (comments && comments.length > 0) {
                const randomIndex = Math.floor(Math.random() * comments.length);
                const randomComment = comments[randomIndex];
                const processedComment = randomComment.replace(/\[Name\]/g, currentStudent.firstName);
                content += processedComment + ' ';
                
                // Store the selected comment for consistency
                updateSectionData(section.id, { 
                  selectedComment: randomComment,
                  selectedCommentIndex: randomIndex 
                });
              }
            }
            
            // Add additional comment if provided
            if (data.additionalComment?.trim()) {
              const processedAdditional = data.additionalComment.trim().replace(/\[Name\]/g, currentStudent.firstName);
              content += processedAdditional + ' ';
            }
          }
          break;
          
        case 'standard-comment':
          // Auto-use the template content if no custom comment is entered
          const standardText = data.comment?.trim() || section.data?.content?.trim() || '';
          if (standardText) {
            const processedComment = standardText.replace(/\[Name\]/g, currentStudent.firstName);
            content += processedComment + ' ';
          }
          break;
          
        case 'assessment-comment':
          if (data.performance && data.performance !== 'no-comment') {
            // Generate score display with more detailed checking
            let scoreText = '';
            
            if (data.scoreType === 'percentage' && data.percentage) {
              scoreText = `${data.percentage}%`;
            } else if (data.scoreType === 'outOf' || !data.scoreType) {
              if (data.score && (data.maxScore || section.data?.maxScore)) {
                const maxScore = data.maxScore || section.data?.maxScore;
                scoreText = `${data.score}/${maxScore}`;
              } else if (data.score) {
                scoreText = data.score;
              }
            }
            
            // Use selected comment or get from template
            if (data.selectedComment) {
              let processedComment = data.selectedComment.replace(/\[Name\]/g, currentStudent.firstName);
              if (scoreText) {
                processedComment = processedComment.replace(/\[Score\]/g, scoreText);
              } else {
                // Remove [Score] placeholder if no score
                processedComment = processedComment.replace(/\[Score\]/g, '').replace(/\s+/g, ' ').trim();
              }
              content += processedComment + ' ';
            } else {
              // Fallback to template data
              const comments = section.data?.performances?.[data.performance];
              if (comments && comments.length > 0) {
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                let processedComment = randomComment.replace(/\[Name\]/g, currentStudent.firstName);
                if (scoreText) {
                  processedComment = processedComment.replace(/\[Score\]/g, scoreText);
                } else {
                  processedComment = processedComment.replace(/\[Score\]/g, '').replace(/\s+/g, ' ').trim();
                }
                content += processedComment + ' ';
              }
            }
            
            // Add additional comment if provided
            if (data.additionalComment?.trim()) {
              let additionalComment = data.additionalComment.trim();
              additionalComment = additionalComment.replace(/\[Name\]/g, currentStudent.firstName);
              if (scoreText) {
                additionalComment = additionalComment.replace(/\[Score\]/g, scoreText);
              }
              content += additionalComment + ' ';
            }
          }
          break;
          
        case 'personalised-comment':
          if (data.personalisedInfo?.trim() && data.category) {
            const comments = section.data?.categories?.[data.category];
            if (comments && comments.length > 0) {
              const randomComment = comments[Math.floor(Math.random() * comments.length)];
              let processedComment = randomComment.replace(/\[Name\]/g, currentStudent.firstName);
              processedComment = processedComment.replace(/\[personalised information\]/g, data.personalisedInfo);
              content += processedComment + ' ';
            }
          }
          break;
          
        case 'next-steps':
          if (data.focusArea && data.priority) {
            const suggestions = section.data?.focusAreas?.[data.focusArea];
            if (suggestions && suggestions.length > 0) {
              const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
              const processedSuggestion = randomSuggestion.replace(/\[Name\]/g, currentStudent.firstName);
              content += processedSuggestion + ' ';
            }
            
            if (data.customSuggestion?.trim()) {
              const processedCustom = data.customSuggestion.replace(/\[Name\]/g, currentStudent.firstName);
              content += processedCustom + ' ';
            }
          }
          break;
          
        case 'optional-additional-comment':
          if (data.include && data.comment?.trim()) {
            const processedComment = data.comment.replace(/\[Name\]/g, currentStudent.firstName);
            content += processedComment + ' ';
          }
          break;
          
        case 'new-line':
          content += '\n\n';
          break;
      }
    });
    
    return content.trim();
  };

  // Save current report
  const handleSaveReport = () => {
    const reportContent = generateReportContent();
    
    saveReport({
      id: `${currentStudent.id}-${template.id}`,
      studentId: currentStudent.id,
      templateId: template.id,
      classId: classData.id,
      content: reportContent,
      sectionData: sectionData
    });
    
    setHasUnsavedChanges(false);
    alert('Report saved successfully!');
  };

  // Navigate to different student
  const handleStudentNavigation = (newIndex: number) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave this report?');
      if (!confirmLeave) return;
    }
    
    setCurrentStudentIndex(newIndex);
  };

  // Copy report to clipboard
  const handleCopyReport = () => {
    const reportContent = generateReportContent();
    navigator.clipboard.writeText(reportContent);
    alert('Report copied to clipboard!');
  };

  // Download report
  const handleDownloadReport = () => {
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStudent.firstName}_${currentStudent.lastName}_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            {template.name}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 0,
            fontSize: '14px'
          }}>
            {classData.name} • {currentStudent.firstName} {currentStudent.lastName}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleSaveReport}
            style={{
              backgroundColor: hasUnsavedChanges ? '#3b82f6' : '#10b981',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Column - Report Form */}
        <div style={{ flex: '1' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '16px'
          }}>
            Report Sections
          </h2>

          {template.sections.map(section => (
            <SectionRenderer 
              key={section.id}
              section={section}
              sectionData={sectionData}
              updateSectionData={updateSectionData}
            />
          ))}
        </div>

        {/* Right Column - Preview */}
        <div style={{ 
          width: '400px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151',
              margin: 0
            }}>
              Report Preview
            </h3>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={handleCopyReport}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <button
                onClick={handleDownloadReport}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Download
              </button>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '16px',
            minHeight: '200px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#374151',
            whiteSpace: 'pre-wrap'
          }}>
            <strong>{currentStudent.firstName} {currentStudent.lastName}</strong>
            <br /><br />
            {generateReportContent() || 'Start filling out the sections to see the report preview...'}
          </div>
        </div>
      </div>

      {/* Student Navigation */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => handleStudentNavigation(currentStudentIndex - 1)}
              disabled={currentStudentIndex === 0}
              style={{
                backgroundColor: currentStudentIndex === 0 ? '#e5e7eb' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              ← Previous
            </button>
            
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Student {currentStudentIndex + 1} of {students.length}
            </span>
            
            <button
              onClick={() => handleStudentNavigation(currentStudentIndex + 1)}
              disabled={currentStudentIndex === students.length - 1}
              style={{
                backgroundColor: currentStudentIndex === students.length - 1 ? '#e5e7eb' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === students.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              Next →
            </button>
          </div>
          
          {hasUnsavedChanges && (
            <span style={{
              fontSize: '12px',
              color: '#ef4444',
              fontStyle: 'italic'
            }}>
              Unsaved changes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}