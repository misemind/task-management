import React from 'react'
import SortText from './Forms/SortText';
import Paragraph from './Forms/Paragraph';
import Date from './Forms/Data';
import Number from './Forms/Number';
import Timestemp from './Forms/Timestemp';
import Labels from './Forms/Labels';
import DropDown from './Forms/DropDown';
import Checkbox from './Forms/Checkbox';
import People from './Forms/People';
import DependentDropdown from './Forms/DependentDropdown';
import UrlForm from './Forms/UrlForm';

interface IProps {
  type: string;
}
const DynamicForm: React.FC<IProps> = ({ type }) => {

  const renderForm = () => {
    switch (type) {
      case 'Sort Text':
        return <SortText />;
      case 'Paragraph':
        return <Paragraph />;
      case 'Date':
        return <Date />;
      case 'Number':
        return <Number />;
      case 'Time Stamp':
        return <Timestemp />;
      case 'Label':
        return <Labels />;
      case 'Dropdown':
        return <DropDown />;
      case 'Checkbox':
        return <Checkbox />
      case 'People':
        return <People />
      case 'Dependent Dropdown':
        return <DependentDropdown />
      case 'URL':
        return <UrlForm />;
      default:
        return <div>No form available for this type.</div>;
    }
  };
  return (
    <>
      {renderForm()}
    </>
  )
}

export default DynamicForm;