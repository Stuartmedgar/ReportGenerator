import React from 'react';
import { TemplateSection } from '../../types';

interface NewLineSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const NewLineSection: React.FC<NewLineSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  return (
    <div style={{
      border: '2px dashed #9ca3af',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      backgroundColor: '#f9fafb',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '16px',
          color: '#6b7280'
        }}>
          ↵
        </span>
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          New Line / Paragraph Break
        </span>
      </div>
      
      <p style={{
        fontSize: '12px',
        color: '#9ca3af',
        margin: '4px 0 0 0'
      }}>
        This will create a line break in the final report
      </p>
    </div>
  );
};

export default NewLineSection;