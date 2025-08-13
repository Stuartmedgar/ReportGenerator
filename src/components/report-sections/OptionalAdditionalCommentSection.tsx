import React from 'react';
import { TemplateSection } from '../../types';

interface OptionalAdditionalCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const OptionalAdditionalCommentSection: React.FC<OptionalAdditionalCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  return (
    <div style={{
      border: '2px solid #fbbf24',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fef2f2'
    }}>
      <div>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          color: '#ef4444',
          marginBottom: '12px'
        }}>
          <input 
            type="checkbox"
            checked={!!data.showOptional}
            onChange={(e) => updateSectionData(section.id, { 
              showOptional: e.target.checked,
              additionalComment: e.target.checked ? (data.additionalComment || '') : undefined
            })}
            style={{ transform: 'scale(1.2)' }}
          />
          <span>Optional Additional Comment</span>
        </label>
        
        {data.showOptional && (
          <textarea
            value={data.additionalComment || ''}
            onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
            placeholder="Enter any additional comments about this student..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OptionalAdditionalCommentSection;