import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { Icon } from 'react-native-elements';

function Header() {
  return(
    <View style={styles.header}>
    <TouchableOpacity>
      <Text style={styles.editText}>並べ替え</Text>
    </TouchableOpacity>
  </View>
  )
}


function Input(props) {
  const [text, setText] = useState('')
  const handleOnSubmitEditing = () => {
    props.addTodo(text)
    setText('')
  }
  
  return(
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(_text) => setText(_text)}
        placeholder="タスクの追加"
        value={text}
        returnKeyType="done"
        onSubmitEditing={handleOnSubmitEditing}
      />
    </View>
  )
}



function Todo(props) {
  const {
    id,
    isCompleted,
    text,
    editTodo,
  } = props
  const [newText, setNewText] = useState(text)
  const handleOnSubmitEditing = () => {
    editTodo(newText, id, isCompleted, false)
  }
  return(
    <View>
      {props.isCompleted ? (
        <Text style={styles.doneTaskItem}>{props.text}</Text>
      ) : (
        <TextInput
        style={styles.inputTaskItem}
        onChangeText={(_text) => setNewText(_text)}
        value={newText}
        returnKeyType='done'
        onSubmitEditing={handleOnSubmitEditing}
        />
      )}
    </View>
  )
}

function MoreHoriz(props) {
  const {
    id,
    isCompleted,
    text,
    editTodo,
  } = props
  const onPressActions = () => {
    const statusWord = isCompleted ? "未完了にする" : "完了にする"
    Alert.alert(text, '', [
      {
        text: statusWord,
        style: 'cancel',
        onPress: () => editTodo(text, id, !isCompleted, false),
      },
      {
        text: '削除します',
        style: 'destructive',
        onPress: () => editTodo(text, id, isCompleted, true),
      },
      {
        text: 'キャンセル',
        style: 'cancel',
      },      
    ])
  }

  return(
    <View>
      <TouchableOpacity onPress={() => onPressActions()}>
        <Icon style={styles.actionButton} name="more-horiz" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}

function TodoArea(props) {
  const {
    id,
    text,
    isCompleted,
    editTodo,
  } = props

  return(
    <View style={styles.taskItem}>
      <Todo id={id} isCompleted={isCompleted} text={text} editTodo={editTodo} />
      <MoreHoriz id={id} isCompleted={isCompleted} text={text} editTodo={editTodo} />
    </View>
  )
}



function TodoList(props) {
  const {
    todoList,
    editTodo
  } = props
  
  return(
    <View style={styles.taskItemList}>
      <FlatList
        data={todoList}
        renderItem={({ item }) => <TodoArea id={item.id} text={item.text} isCompleted={item.isCompleted} editTodo={editTodo}/>}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  )
}



function Main() {
  const [todo, setTodo] = useState([])
  
  const addTodo = (text) => {
    const newTodo = [].concat(todo)
    newTodo.push({
      text,
      id: todo.length,
      isCompleted: false
    })
    setTodo(newTodo)
    console.log(`新しいTODリスト:${JSON.stringify(newTodo)}`)
  }

  const editTodo = (text, id, isCompleted, isDelete) => {
    const newTodo = [].concat(todo)
    if (isDelete) {
      const deletedTodoList = newTodo.filter(item => item.id !== id)
      setTodo(deletedTodoList)
      return
    }
    const editTargetTodo = newTodo.find(item => item.id === id)
    editTargetTodo.text = text
    editTargetTodo.isCompleted = isCompleted
    setTodo(newTodo)
  }


  return(
    <View style={styles.main}>
      <Input addTodo={addTodo} todo={todo} />
      <TodoList todoList={todo} editTodo={editTodo} />
    </View>
  )
}



export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <Main />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'skyblue',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingBottom: 10,
  },
  editText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'right',
  },
  main: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  taskItemList: {
    flex: 1,
  },
  doneTaskItem: {
    width: '100px',
    color: 'gray',
    textDecorationLine: 'line-through',
  },
  inputTaskItem: {
    flexGrow: 1,
  },
  actionButton: {
    padding: 10,
  },
});


