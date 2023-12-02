def code_to_string(file_path):
    try:
        with open(file_path, 'r') as file:
            code_content = file.read()
            # Replace newlines with \n and tabs with \t
            formatted_code = code_content.replace('\n', '\\n').replace('\t', '\\t')
            return formatted_code
    except FileNotFoundError:
        return f"File not found: {file_path}"
    except Exception as e:
        return f"Error reading file: {e}"

# Example usage:
file_path = "backend/db/mock/files/test_file_five.js"
formatted_code = code_to_string(file_path)
print(formatted_code)