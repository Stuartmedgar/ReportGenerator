import React from 'react';
import { TemplateSection } from '../../types';

interface NextStepsSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const NextStepsSection: React.FC<NextStepsSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  const headings = section.data?.headings || [];

  return (
    <div style={{
      border: '2px solid #06b6d4',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#ecfeff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#0891b2',
          margin: 0
        }}>
          {section.name || 'Next Steps'}
        </h3>
      </div>

      {/* Focus Area Selection */}
      {headings.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Focus Area:
          </label>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            {headings.map((heading: string, index: number) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: data.selectedFocus === heading ? '#06b6d4' : '#f3f4f6',
                color: data.selectedFocus === heading ? 'white' : '#374151',
                fontWeight: data.selectedFocus === heading ? '500' : '400',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                justifyContent: 'center'
              }}>
                <input
                  type="radio"
                  name={`focus-${section.id}`}
                  value={heading}
                  checked={data.selectedFocus === heading}
                  onChange={(e) => updateSectionData(section.id, { selectedFocus: e.target.value })}
                  style={{ margin: 0 }}
                />
                {heading}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Priority Level */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '12px'
        }}>
          Priority Level:
        </label>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          {[
            { value: 'high', label: '🔥 High Priority', color: '#ef4444' },
            { value: 'medium', label: '⚡ Medium Priority', color: '#f59e0b' },
            { value: 'low', label: '📝 Low Priority', color: '#10b981' }
          ].map(priority => (
            <label key={priority.value} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: data.priority === priority.value ? priority.color : '#f3f4f6',
              color: data.priority === priority.value ? 'white' : '#374151',
              fontWeight: data.priority === priority.value ? '500' : '400',
              transition: 'all 0.2s ease',
              flex: 1,
              justifyContent: 'center'
            }}>
              <input
                type="radio"
                name={`priority-${section.id}`}
                value={priority.value}
                checked={data.priority === priority.value}
                onChange={(e) => updateSectionData(section.id, { priority: e.target.value })}
                style={{ margin: 0 }}
              />
              {priority.label}
            </label>
          ))}
        </div>
      </div>

      {/* Include Section Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <input
            type="checkbox"
            checked={data.includeSection !== false}
            onChange={(e) => updateSectionData(section.id, { includeSection: e.target.checked })}
            style={{ transform: 'scale(1.1)' }}
          />
          <span>Include this section in the report</span>
        </label>
      </div>

      {/* Additional Suggestions */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Additional Suggestions (Optional):
        </label>
        <textarea
          value={data.additionalSuggestions || ''}
          onChange={(e) => updateSectionData(section.id, { additionalSuggestions: e.target.value })}
          placeholder="Add any specific next steps or suggestions for this student..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '80px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '4px 0 0 0',
          fontStyle: 'italic'
        }}>
          Use [Name] as a placeholder for the student's first name
        </p>
      </div>
    </div>
  );
};

export default NextStepsSection;