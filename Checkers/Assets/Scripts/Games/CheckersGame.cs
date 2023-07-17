using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CheckersGame : MonoBehaviour
{
    // Start is called before the first frame update

    void Start()
    {
        switch (true)
        {
            default:
                gameObject.AddComponent<CheckersBoard>();
                break;
        }
    }
}
