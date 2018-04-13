package com.ls.Comments.Service.Impl;

import com.ls.Comments.Service.GiveService;
import com.ls.Comments.dao.GiveMapper;
import com.ls.Comments.pojo.Give;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author chenqiang
 */
@Service
public class GiveServiceImpl implements GiveService {
    @Autowired
    GiveMapper giveMapper;
    /**
     * 保存点击
     * @return
     */
    public int savaGive(Give give) {
        giveMapper.insert(give);
        return 0;
    }


}
