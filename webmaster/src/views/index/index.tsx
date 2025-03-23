import { defineComponent } from 'vue';
import Button from '@/components/Button.tsx';

export default defineComponent({
  name: 'IndexView',
  setup() {
    return () => (
      <div>
        {[1, 2, 10].map((item) => (
          <p key={item}>
            item
          </p>
        ))}
        <Button onClick={() => console.log('hello')} text={'text'} />
      </div>
    );
  }
});
